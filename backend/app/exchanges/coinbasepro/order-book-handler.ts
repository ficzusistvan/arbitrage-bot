// GENERAL DEPENDENCIES
import moment from 'moment';
import Big from 'big.js';

// DEBUGGING
import Debug from 'debug'
const debug = Debug('order-book-handler-coinbasepro')

// ARBITER DEPENDENCIES
import * as eventHandler from '../../event-handler'
import * as gi from '../interfaces'

// COINBASEPRO
import * as i from './interfaces'

// VARIABLES
let orderBook: i.ISnapshotInt;
let obData: gi.IOBData;

const IDX_PRICE = 0;
const IDX_QTY = 1;

let init = function (snapshot: i.ISnapshotInt) {
  orderBook = snapshot;
  debug('Entire orderbook snapshot', JSON.stringify(orderBook));
  obData = {
    askPrice: orderBook.asks[0][IDX_PRICE],
    askQuantity: orderBook.asks[0][IDX_QTY],
    bidPrice: orderBook.bids[0][IDX_PRICE],
    bidQuantity: orderBook.bids[0][IDX_QTY],
    updatedAt: moment()
  };
  const exchangeOBData: gi.IExchangeOBData = {
    exchange: i.COINBASEPRO,
    obData: obData
  };
  eventHandler.em.emit(eventHandler.BEST_PRICES_INITIALISED, exchangeOBData);
}

let updateHelper = function (originalArray: Array<[Big, Big]>, changesArray: Array<[Big, Big]>, order: gi.EOrder): Array<[Big, Big]> {
  // Add, update or remove
  let updatedArray = originalArray;
  for (const change of changesArray) {
    debug('Handling change', change);
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
        updatedArray.splice(index, 0, change);
        debug('Added change', change);
      }
    }
  }

  return updatedArray;
}

let update = function (update: i.IL2updateInt) {
  debug('Updating orderbook', JSON.stringify(update));
  let isUpdated = false;

  let buys: Array<[Big, Big]> = [];
  let sells: Array<[Big, Big]> = [];
  // Separate 'buy's from 'sel's
  for (const change of update.changes) {
    const el: [Big, Big] = [change[1], change[2]];
    if (change[0] === 'buy') {
      buys.push(el);
    } else if (change[0] === 'sell') {
      sells.push(el);
    } else {
      // nothing to do
    }
  }

  debug('Separated buys', JSON.stringify(buys));
  debug('Separated sells', JSON.stringify(sells));

  if (buys.length > 0) {
    orderBook.bids = updateHelper(orderBook.bids, buys, gi.EOrder.Desc);
    debug('Updated orderBook.bids', JSON.stringify(orderBook.bids));
  }

  if (sells.length > 0) {
    orderBook.asks = updateHelper(orderBook.asks, sells, gi.EOrder.Asc);
    debug('Updated orderBook.asks', JSON.stringify(orderBook.asks));
  }

  debug('Updated order book for [' + i.COINBASEPRO + '] at [' + moment(update.time).format() + ']');

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
      exchange: i.COINBASEPRO,
      obData: obData
    };
    eventHandler.em.emit(eventHandler.BEST_PRICES_UPDATED, exchangeOBData);
  }
}

let getSnapshot = function (): i.ISnapshotInt {
  return orderBook;
}

export {
  init,
  update,
  getSnapshot
}