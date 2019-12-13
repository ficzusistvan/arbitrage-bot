// GENERAL DEPENDENCIES
import Big from 'big.js'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});
import moment from 'moment'
import ccxt from 'ccxt'
import cron from 'cron'
const PushBullet = require('pushbullet')

// DEBUGGING
import Debug from 'debug'
const debug = Debug('arbiter')

// ARBITER DEPENDENCIES
import { logger } from './logger'
import * as i from './interfaces'
import * as gi from './exchanges/interfaces'
import * as eventHandler from './event-handler'
import knex from './db/knex'
import * as utils from './utils'

// VARIABLES
const MIN_PROFITABILITY = nconf.get('arbiter:min_profitability');
const PUSHBULLET_API_KEY = nconf.get('pushbullet:api_key');
const PUSHBULLET_EMAIL = nconf.get('pushbullet:email');
const TOFIXED_PRICE = 6;
const TOFIXED_SIZE = 4;
const TOFIXED_FEE = 4;
const PADDING_LENGTH = 16;

const pusher = new PushBullet(PUSHBULLET_API_KEY);

const exchange1Cfg: i.IExchange = nconf.get('exchange1');
const exchange2Cfg: i.IExchange = nconf.get('exchange2');
let exchange1Impl: any;
let exchange2Impl: any;
let exchange1Fees: gi.IFees;
let exchange2Fees: gi.IFees;

let updateFeesJob = new cron.CronJob('* * * * * *', () => { // run every hour and at app startup
  debug('Running cron job to update exchange fees');
  let promise1: Promise<gi.IFees> = exchange1Impl.getFees(exchange1Cfg.api_key, exchange1Cfg.secret_key, exchange1Cfg.passphrase);
  promise1.then(fees1 => {
    logger.info('Current fees for exchange [%s]: [%O]', exchange1Cfg.name, { maker: fees1.maker.toFixed(TOFIXED_FEE), taker: fees1.taker.toFixed(TOFIXED_FEE) });
    exchange1Fees = fees1;
  });
  let promise2: Promise<gi.IFees> = exchange2Impl.getFees(exchange2Cfg.api_key, exchange2Cfg.secret_key, exchange2Cfg.passphrase);
  promise2.then(fees2 => {
    logger.info('Current fees for exchange [%s]: [%O]', exchange2Cfg.name, { maker: fees2.maker.toFixed(TOFIXED_FEE), taker: fees2.taker.toFixed(TOFIXED_FEE) });
    exchange2Fees = fees2;
  });
  updateFeesJob.setTime(new cron.CronTime('0 0 * * * *')); // reconfigure job recurrence
});

let start = async function () {
  debug('ccxt supported exchanges length', ccxt.exchanges.length);
  debug('Importing exchanges...');
  debug('Importing', exchange1Cfg.name);
  exchange1Impl = await import('./exchanges/' + exchange1Cfg.name + '/exchange');
  debug('Importing', exchange2Cfg.name);
  exchange2Impl = await import('./exchanges/' + exchange2Cfg.name + '/exchange');
  debug('Starting order book streaming for', exchange1Cfg.name);
  const pair1 = {
    symbol: exchange1Cfg.symbol,
    baseAsset: exchange1Cfg.base_asset,
    quoteAsset: exchange1Cfg.quote_asset
  }
  exchange1Impl.startBidAskStreaming(pair1, exchange1Cfg.ws_timeout_ms.restart, exchange1Cfg.ws_timeout_ms.ping);
  debug('Starting order book streaming for', exchange2Cfg.name);
  const pair2 = {
    symbol: exchange2Cfg.symbol,
    baseAsset: exchange2Cfg.base_asset,
    quoteAsset: exchange2Cfg.quote_asset
  }
  exchange2Impl.startBidAskStreaming(pair2, exchange2Cfg.ws_timeout_ms.restart, exchange2Cfg.ws_timeout_ms.ping);
  updateFeesJob.start(); // exchangeImplMap is initializes, start job.
}

let exchangeInitialized = function (exchangeOBData: gi.IExchangeOBData) {
  debug('exchangeInitialized', exchangeOBData.exchange);
  if (exchange1Cfg.name === exchangeOBData.exchange) {
    isExchange1Connected = true;
    exchange1obData = exchangeOBData.obData;
  }
  if (exchange2Cfg.name === exchangeOBData.exchange) {
    isExchange2Connected = true;
    exchange2obData = exchangeOBData.obData;
  }
  eventHandler.em.emit(eventHandler.ARBITER_RUN_END, '');
}

let exchangeDisconnected = function (exchange: string) {
  debug('exchangeDisconnected', exchange);
  if (exchange1Cfg.name === exchange) {
    isExchange1Connected = false;
  }
  if (exchange2Cfg.name === exchange) {
    isExchange2Connected = false;
  }
  eventHandler.em.emit(eventHandler.ARBITER_RUN_END, '');
}

let exchange1obData: gi.IOBData;
let exchange2obData: gi.IOBData;
let isExchange1Connected: boolean = false;
let isExchange2Connected: boolean = false;
let lastOpportunityDirection: i.EDirection = i.EDirection.none;

let run2 = async function (exchangeOBData: gi.IExchangeOBData) {
  debug('Running');
  if (exchange1Cfg.name === exchangeOBData.exchange) {
    exchange1obData = exchangeOBData.obData;
  }
  if (exchange2Cfg.name === exchangeOBData.exchange) {
    exchange2obData = exchangeOBData.obData;
  }
  if (isExchange1Connected && exchange1obData !== undefined) {
    const fixedBidPrice1 = exchange1obData.bidPrice.toFixed(TOFIXED_PRICE).padStart(PADDING_LENGTH, ' ');
    const fixedAskPrice1 = exchange1obData.askPrice.toFixed(TOFIXED_PRICE).padStart(PADDING_LENGTH, ' ');
    const fixedBidQuantity1 = exchange1obData.bidQuantity.toFixed(TOFIXED_SIZE).padStart(PADDING_LENGTH, ' ');
    const fixedAskQuantity1 = exchange1obData.askQuantity.toFixed(TOFIXED_SIZE).padStart(PADDING_LENGTH, ' ');
    //debug('[%s] : bid price[%s] size[%s] <-> ask price[%s] size[%s] at %s', exchange1Cfg.fixed_length_name, fixedBidPrice1, fixedBidQuantity1, fixedAskPrice1, fixedAskQuantity1, exchange1obData.updatedAt);
    logger.info('[%s] : bid price[%s] size[%s] <-> ask price[%s] size[%s] at %s', exchange1Cfg.fixed_length_name, fixedBidPrice1, fixedBidQuantity1, fixedAskPrice1, fixedAskQuantity1, exchange1obData.updatedAt);
  }
  if (isExchange2Connected && exchange2obData !== undefined) {
    const fixedBidPrice2 = exchange2obData.bidPrice.toFixed(TOFIXED_PRICE).padStart(PADDING_LENGTH, ' ');
    const fixedAskPrice2 = exchange2obData.askPrice.toFixed(TOFIXED_PRICE).padStart(PADDING_LENGTH, ' ');
    const fixedBidQuantity2 = exchange2obData.bidQuantity.toFixed(TOFIXED_SIZE).padStart(PADDING_LENGTH, ' ');
    const fixedAskQuantity2 = exchange2obData.askQuantity.toFixed(TOFIXED_SIZE).padStart(PADDING_LENGTH, ' ');
    //debug('[%s] : bid price[%s] size[%s] <-> ask price[%s] size[%s] at %s', exchange2Cfg.fixed_length_name, fixedBidPrice2, fixedBidQuantity2, fixedAskPrice2, fixedAskQuantity2, exchange2obData.updatedAt);
    logger.info('[%s] : bid price[%s] size[%s] <-> ask price[%s] size[%s] at %s', exchange2Cfg.fixed_length_name, fixedBidPrice2, fixedBidQuantity2, fixedAskPrice2, fixedAskQuantity2, exchange2obData.updatedAt);
  }

  // Get updated prices for exchange
  //  let updatedPrices: gi.IBestPrices = exchangeImplMap.get(exchange).getBestBidAsk();
  // emit (broadcast) message with orderbook snapshot
  //  const snapshot: gi.ISnapshot = exchangeImplMap.get(exchange).getSnapshot();
  //  io.emit('snapshot', snapshot);
  if ((isExchange1Connected && exchange1obData !== undefined) && (isExchange2Connected && exchange2obData !== undefined)) {
    // calculate possible profitability
    const result: i.IProfitability = utils.getProfitability(exchange1obData, exchange2obData, exchange1Fees, exchange2Fees, exchange1Cfg, exchange2Cfg);
    if (result.direction !== i.EDirection.none && result.profitability.gte(MIN_PROFITABILITY)) {
      const dtServer: moment.Moment = moment();
      // check if this opportunity was already handled?
      if (lastOpportunityDirection !== result.direction) {
        // no... save it, so we can check next time
        lastOpportunityDirection = result.direction;
        // save opportunity with price details for tracking, statistics
        logger.info('Arbitrage opportunity %O at %s', JSON.stringify(result), dtServer);
        await knex('opportunities').insert({
          direction: result.direction,
          ask_price: result.askPair.price.toFixed(TOFIXED_PRICE),
          ask_quantity: result.askPair.size.toFixed(TOFIXED_SIZE),
          bid_price: result.bidPair.price.toFixed(TOFIXED_PRICE),
          bid_quantity: result.bidPair.size.toFixed(TOFIXED_SIZE),
          possible_profit: result.possibleProfit.toFixed(TOFIXED_PRICE),
          profit_currency: result.profitCurrency,
          dt_server: dtServer.toISOString()
        });
        await pusher.note(PUSHBULLET_EMAIL, 'Arbitrage opportunity', JSON.stringify({ ...result, ...{ dt_server: dtServer.toISOString() } })); /*, function(error: any, response: any) {
          if(error) {
            logger.error('Pushbullet error', error);
          }
          logger.info('Pushbullet push id', response.iden);
        });*/
        eventHandler.em.emit(eventHandler.STOP_ARBITER, '');
      } else {
        // yes... skip handling it
        logger.info('Skipping handling, this was already handled');
      }
    } else {
      logger.info('Skipping handling, no opportunity; profitablity [%s]', result.profitability.toFixed(TOFIXED_PRICE));
      lastOpportunityDirection = i.EDirection.none;
    }
  }

  eventHandler.em.emit(eventHandler.ARBITER_RUN_END, '');
}

export {
  start,
  exchangeInitialized,
  run2,
  exchangeDisconnected
};