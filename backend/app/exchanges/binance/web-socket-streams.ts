// DEBUGGING
import Debug from 'debug'
const debug = Debug('web-socket-streams-binance')

// VARIABLES
const BASE_ENDPOINT = 'wss://stream.binance.com:9443';
const RAW_STREAM = '/ws/';
const SYMBOL = '<symbol>';
export const AggregateTradeStreams = '<symbol>@aggTrade';
export const TradeStreams = '<symbol>@trade';
export const KlineCandlestickStreams = '<symbol>@kline_<interval>';
export const IndividualSymbolMiniTickerStream = '<symbol>@miniTicker';
export const AllMarketMiniTickersStream = '!miniTicker@arr';
export const IndividualSymbolTickerStreams = '<symbol>@ticker';
export const AllMarketTickersStream = '!ticker@arr';
export const PartialBookDepthStreams = '<symbol>@depth<levels>';
export const DiffDepthStream = '<symbol>@depth';

export const readyStates = ['CONNECTING', /* 0 Socket has been created. The connection is not yet open. */
  'OPEN', /* 1 The connection is open and ready to communicate. */
  'CLOSING', /* 2 The connection is in the process of closing. */
  'CLOSED' /* 3 The connection is closed or couldn't be opened. */];

/**
 * stream - e.g.: !ticker@arr
 * symbol - e.g.: btcusdt
 * param - key - value pair. e.g.: key = interval, value = 1h
 */
let buildWsAddress = function (stream: string, symbol: string, param: any): string {
  var addr: string = BASE_ENDPOINT + RAW_STREAM + stream;
  if (symbol) {
    addr = addr.replace(SYMBOL, symbol);
  }
  if (param) {
    Object.keys(param).forEach((key: string) => addr = addr.replace(key, param[key]));
  }
  debug('Web socket address:', addr);
  return addr;
}

export {
  buildWsAddress
}