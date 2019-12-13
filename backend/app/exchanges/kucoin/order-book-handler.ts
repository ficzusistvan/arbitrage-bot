// GENERAL DEPENDENCIES
import moment from 'moment';
import Big from 'big.js';

// DEBUGGING
import Debug from 'debug'
const debug = Debug('order-book-handler-kucoin')

// ARBITER DEPENDENCIES
import * as eventHandler from '../../event-handler'
import * as gi from '../interfaces'

// KUCOIN
import * as i from './interfaces'

// VARIABLES
let orderBook: i.ISnapshotInt;
let orderBookCache: Array<i.IL2updateInt> = [];
let obData: gi.IOBData;

const IDX_PRICE = 0;
const IDX_QTY = 1;

let cache = function (update: i.IL2updateInt) {
  debug('Caching orderbook update', JSON.stringify(update));
  orderBookCache.push(update);
}

let init = function (snapshot: i.ISnapshotInt) {
  orderBook = snapshot;
  debug('Snapshot received', JSON.stringify(snapshot));
  orderBookCache.forEach(orderBookCacheItem => {
    const asks = orderBookCacheItem.changes.asks;
    if (asks.length > 0) {
      orderBook.asks = updateHelper(orderBook.asks, asks, gi.EOrder.Asc);
    }
    const bids = orderBookCacheItem.changes.bids;
    if (bids.length > 0) {
      orderBook.bids = updateHelper(orderBook.bids, bids, gi.EOrder.Desc);
    }
  })
  debug('Entire orderbook snapshot', JSON.stringify(orderBook));
  obData = {
    askPrice: orderBook.asks[0][IDX_PRICE],
    askQuantity: orderBook.asks[0][IDX_QTY],
    bidPrice: orderBook.bids[0][IDX_PRICE],
    bidQuantity: orderBook.bids[0][IDX_QTY],
    updatedAt: moment()
  };
  const exchangeOBData: gi.IExchangeOBData = {
    exchange: i.KUCOIN,
    obData: obData
  };
  eventHandler.em.emit(eventHandler.BEST_PRICES_INITIALISED, exchangeOBData);
}

let updateHelper = function (originalArray: Array<[Big, Big]>, changesArray: Array<[Big, Big, number]>, order: gi.EOrder): Array<[Big, Big]> {
  // Add, update or remove
  let updatedArray = originalArray;
  for (const change of changesArray) {
    debug('Handling change', change);
    if (change[2] > orderBook.sequence && !change[0].eq(0)) {
      if (change[1].eq(0)) {
        // remove
        updatedArray = updatedArray.filter(item => {
          return !item[0].eq(change[0]);
        })
        debug('Removed change', change);
      } else {
        let updated = false;
        updatedArray = updatedArray.map(item => {
          let newItem = item;
          if (newItem[0].eq(change[0])) {
            newItem[1] = change[1];
            debug('Updated change', change);
            updated = true;
          }
          return newItem;
        })

        if (!updated) {
          let index: number = 0;
          if (order === gi.EOrder.Asc) {
            updatedArray.some((item, idx) => {
              index = idx;
              return item[0].gt(change[0]);
            })
          } else {
            updatedArray.some((item, idx) => {
              index = idx;
              return item[0].lt(change[0]);
            })
          }
          updatedArray.splice(index, 0, [change[0], change[1]]); // we don't need sequence number anymore
          debug('Added change', change);
        }
      }
    } else {
      debug('Skipping change', JSON.stringify(change));
    }
  }

  return updatedArray;
}

let update = function (update: i.IL2updateInt) {
  debug('Updating orderbook', JSON.stringify(update));
  let isUpdated = false;

  if (update.changes.bids.length > 0) {
    orderBook.bids = updateHelper(orderBook.bids, update.changes.bids, gi.EOrder.Desc);
    debug('Updated orderBook.bids', JSON.stringify(orderBook.bids));
  }

  if (update.changes.asks.length > 0) {
    orderBook.asks = updateHelper(orderBook.asks, update.changes.asks, gi.EOrder.Asc);
    debug('Updated orderBook.asks', JSON.stringify(orderBook.asks));
  }

  debug('Updated order book for [' + i.KUCOIN + '] old sequence [' + orderBook.sequence + '] new sequence [' + update.sequenceEnd + '] at [' + moment().format() + ']');
  orderBook.sequence = update.sequenceEnd;

  if (!orderBook.asks[0][IDX_PRICE].eq(obData.askPrice)) {
    obData.askPrice = orderBook.asks[0][IDX_PRICE];
    obData.askQuantity = orderBook.asks[0][IDX_QTY];
    isUpdated = true;
  }
  if (!orderBook.bids[0][IDX_PRICE].eq(obData.bidPrice)) {
    obData.bidPrice = orderBook.bids[0][IDX_PRICE];
    obData.bidQuantity = orderBook.bids[0][IDX_QTY];
    isUpdated = true;
  }

  if (isUpdated) {
    obData.updatedAt = moment();
    const exchangeOBData: gi.IExchangeOBData = {
      exchange: i.KUCOIN,
      obData: obData
    };
    eventHandler.em.emit(eventHandler.BEST_PRICES_UPDATED, exchangeOBData);
  }
}

export {
  cache,
  init,
  update
}