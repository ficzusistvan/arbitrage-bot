// GENERAL DEPENDENCIES
import Emittery from 'emittery';
export const em = new Emittery(); // export as soon as possible. See: https://coderwall.com/p/myzvmg/circular-dependencies-in-node-js
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});

// DEBUGGING
import Debug from 'debug'
const debug = Debug('event-handler')

// ARBITER DEPENDENCIES
import * as arbiter from './arbiter'
import { logger } from './logger'
import * as i from './exchanges/interfaces'
import * as gi from './interfaces'

// VARIABLES
const exchange1Cfg: gi.IExchange = nconf.get('exchange1');
const exchange2Cfg: gi.IExchange = nconf.get('exchange2');
let exchange1Inst: any;
let exchange2Inst: any;

export const HTTP_SERVER_INITIALISED = 'HTTP_SERVER_INITIALISED';
export const BEST_PRICES_INITIALISED = 'BEST_PRICES_INITIALISED';
export const BEST_PRICES_UPDATED = 'BEST_PRICES_UPDATED';
export const ARBITER_RUN_END = 'ARBITER_RUN_END';
export const MIN_TRADE_AMOUNT_REACHED = 'MIN_TRADE_AMOUNT_REACHED';
export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
export const STOP_ARBITER = 'STOP_ARBITER';

em.on(HTTP_SERVER_INITIALISED, async function (data) {
  logger.info('HttpServerInitialized [%s]', data);
  logger.info('Starting arbiter...');
  debug('Importing', exchange1Cfg.name);
  exchange1Inst = await import('./exchanges/' + exchange1Cfg.name + '/exchange');
  debug('Importing', exchange2Cfg.name);
  exchange2Inst = await import('./exchanges/' + exchange2Cfg.name + '/exchange');
  arbiter.start();
});

em.on(ARBITER_RUN_END, function (data) {
  exchange1Inst.notifyBotIsIdle();
  exchange2Inst.notifyBotIsIdle();
});

em.on(BEST_PRICES_INITIALISED, (exchangeOBData: i.IExchangeOBData) => {
  arbiter.exchangeInitialized(exchangeOBData);
});

em.on(BEST_PRICES_UPDATED, (exchangeOBData: i.IExchangeOBData) => {
  arbiter.run2(exchangeOBData);
});

em.on(WEBSOCKET_DISCONNECTED, (exchange: string) => {
  arbiter.exchangeDisconnected(exchange);
});

em.on(MIN_TRADE_AMOUNT_REACHED, function (data) {
  // TODO
  logger.warn('Arbiter stopped! Not enough money!');
  em.clearListeners();
});

em.on(STOP_ARBITER, function (data) {
  logger.warn('Exiting application!!!');
  process.exit();
});