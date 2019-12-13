// GENERAL DEPENDENCIES
import request from 'request'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});

// DEBUGGING
import Debug from 'debug'
const debug = Debug('rest-api-binance')

// ARBITER DEPENDENCIES
import * as helpers from './helpers'

// BINANCE
import * as i from './interfaces'

// VARIABLES
const BASE_ENDPOINT = 'https://api.binance.com';
/** Security Type	NONE: Endpoint can be accessed freely. */
const URL_EXCHANGE_INFO           = '/api/v1/exchangeInfo';
const URL_ORDER_BOOK              = '/api/v1/depth';
const URL_KLINE_CANDLESTICK_DATA  = '/api/v1/klines';
const URL_SYMBOL_ORDER_BOOK_TICKER= '/api/v3/ticker/bookTicker';
/** Security Type TRADE: Endpoint requires sending a valid API-Key and signature. */
const URL_NEW_ORDER               = '/api/v3/order';
const URL_CANCEL_ORDER            = '/api/v3/order';
/** Security Type	USER_DATA: Endpoint requires sending a valid API-Key and signature. */
const URL_QUERY_ORDER             = '/api/v3/order';
const URL_CURRENT_OPEN_ORDERS     = '/api/v3/openOrders';
const URL_ALL_ORDERS              = '/api/v3/allOrders';
const URL_ACCOUNT_INFORMATION     = '/api/v3/account';
const URL_ACCOUNT_TRADE_LIST      = '/api/v3/myTrades';

const DEFAULT_RECV_WINDOW = 5000;

/** 
 * GENERAL ENDPOINTS
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#general-endpoints 
 */
/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#exchange-information
 * Current exchange trading rules and symbol information
 * Weight: 1
 */
let getExchangeInfo = async function () {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_ENDPOINT + URL_EXCHANGE_INFO,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getExchangeInfo [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getExchangeInfo!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * MARKET DATA ENDPOINTS
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#market-data-endpoints
 */

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#order-book
 * Weight: Adjusted based on the limit
 */

let getOrderBook = async function(_symbol: string, _limit: number) {
  return new Promise<i.ISnapshotExt>((resolve, reject) => {
    var queryString = '?symbol=' + _symbol;
    if (_limit != undefined) {
      queryString += '&limit=' + _limit;
    }
    request({
      url: BASE_ENDPOINT + URL_ORDER_BOOK + queryString,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getOrderBook', body);
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getOrderBook!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-data
 * Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.
 * Weight: 1
 */
let getKLineCandlestickData = async function (_symbol: string, _interval: string, _limit: number) {
  return new Promise<Array<Array<string>>>((resolve, reject) => {
    var queryString = '?symbol=' + _symbol + '&interval=' + _interval;
    if (_limit != undefined) {
      queryString += '&limit=' + _limit;
    }
    request({
      url: BASE_ENDPOINT + URL_KLINE_CANDLESTICK_DATA + queryString,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getKLineCandlestickData [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getKLineCandlestickData!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#symbol-order-book-ticker
 * Best price/qty on the order book for a symbol or symbols.
 * Weight: 1 for a single symbol; 2 when the symbol parameter is omitted
 */
let getSymbolOrderBookTicker = async function(_symbol: string) {
  return new Promise((resolve, reject) => {
    var queryString = '';
    if (_symbol != undefined) {
      queryString += '?symbol=' + _symbol;
    }
    request({
      url: BASE_ENDPOINT + URL_SYMBOL_ORDER_BOOK_TICKER + queryString,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getSymbolOrderBookTicker [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getSymbolOrderBookTicker!');
      } else {
        resolve(body);
      }
    });
  });
}

/** 
 * ACCOUNT ENDPOINTS
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-endpoints 
 */

/** 
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#new-order--trade 
 * Send in a new order.
 * Iceberg orders are large single orders that have been divided into smaller limit orders, 
 * usually through the use of an automated program, for the purpose of hiding the actual order quantity. 
 * The term "iceberg" comes from the fact that the visible lots are just the "tip of the iceberg" 
 * given the greater number of limit orders ready to be placed.
 * Weight: 1
 */
let newOrder = async function (_symbol: string, _side: string, _type: string, _quantity: number, /* OPTIONALS */_timeInForce: any, _price: any, _stopPrice: any, _icebergQty: any) {
  return new Promise((resolve, reject) => {
    var queryString = 'newOrderRespType=RESULT&symbol=' + _symbol + '&side=' + _side + '&type=' + _type + '&quantity=' + _quantity + '&recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    switch (_type) {
      case module.exports.ORDER_TYPE_LMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price;
        break;
      case module.exports.ORDER_TYPE_MARKET:
        break;
      case module.exports.ORDER_TYPE_STOP_LOSS:
        queryString += '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_STOP_LOSS_LIMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price + '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_TAKE_PROFIT:
        queryString += '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_TAKE_PROFIT_LIMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price + '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_LIMIT_MAKER:
        queryString += '&price=' + _price;
        break;
    }
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      method: 'POST',
      url: BASE_ENDPOINT + URL_NEW_ORDER + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('newOrder [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to POST newOrder!');
      } else {
        resolve(body);
      }
    });
  });
}

/** 
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#test-new-order-trade
 * Test new order creation and signature/recvWindow long. Creates and validates a new order but does not send it into the matching engine.
 * Weight: 1
 */
let testNewOrder = async function (_symbol: string, _side: string, _type: string, _timeInForce: any, _quantity: any, _price: any, _stopPrice: any, _icebergQty: any) {
  return new Promise((resolve, reject) => {
    var queryString = 'newOrderRespType=RESULT&symbol=' + _symbol + '&side=' + _side + '&type=' + _type + '&quantity=' + _quantity + '&recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    switch (_type) {
      case module.exports.ORDER_TYPE_LMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price;
        break;
      case module.exports.ORDER_TYPE_MARKET:
        break;
      case module.exports.ORDER_TYPE_STOP_LOSS:
        queryString += '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_STOP_LOSS_LIMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price + '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_TAKE_PROFIT:
        queryString += '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_TAKE_PROFIT_LIMIT:
        queryString += '&timeInForce=' + _timeInForce + '&price=' + _price + '&stopPrice=' + _stopPrice;
        break;
      case module.exports.ORDER_TYPE_LIMIT_MAKER:
        queryString += '&price=' + _price;
        break;
    }
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      method: 'POST',
      url: BASE_ENDPOINT + URL_NEW_ORDER + '/test?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('testNewOrder [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to POST testNewOrder!');
      } else {
        resolve(body);
      }
    });
  });
}

/** 
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#query-order-user_data
 * Check an order's status.
 * Weight: 1
 */
let queryOrder = async function (_symbol: string, _orderId: string) {
  return new Promise((resolve, reject) => {
    var queryString = 'symbol=' + _symbol + '&orderId=' + _orderId + '&recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      url: BASE_ENDPOINT + URL_QUERY_ORDER + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('queryOrder [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to queryOrder!');
      } else {
        resolve(body);
      }
    });
  });
}

/** 
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#cancel-order-trade
 * Cancel an active order.
 * Weight: 1
 */
let cancelOrder = async function (_symbol: string, _orderId: string) {
  return new Promise((resolve, reject) => {
    var queryString = 'symbol=' + _symbol + '&orderId=' + _orderId + '&recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      method: 'DELETE',
      url: BASE_ENDPOINT + URL_CANCEL_ORDER + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('cancelOrder [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to cancelOrder!');
      } else {
        resolve(body);
      }
    });
  });
}

/** 
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#current-open-orders-user_data
 * Get all open orders on a symbol. Careful when accessing this with no symbol.
 * Weight: 1 for a single symbol; 40 when the symbol parameter is omitted
 */
let getCurrentOpenOrders = async function (_symbol: string) {
  return new Promise((resolve, reject) => {
    var queryString = 'recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    if (_symbol != undefined) {
      queryString += '&symbol=' + _symbol;
    }
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      url: BASE_ENDPOINT + URL_CURRENT_OPEN_ORDERS + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('getCurrentOpenOrders [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getCurrentOpenOrders!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#all-orders-user_data
 * Get all account orders; active, canceled, or filled.
 * Weight: 5 with symbol
 */
let getAllOrders = async function (_symbol: string, _startTime: any, _endTime: any) {
  return new Promise((resolve, reject) => {
    var queryString = 'recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date()) + '&symbol=' + _symbol;
    if (_startTime != undefined && _endTime != undefined) {
      queryString += '&startTime=' + _startTime + '&endTime=' + _endTime;
    }
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      url: BASE_ENDPOINT + URL_ALL_ORDERS + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('getAllOrders [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getAllOrders!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-information-user_data
 * Get current account information.
 * Weight: 5
 */
let getAccountInformation = async function (apiKey: string, secretKey: string) {
  return new Promise<i.IAccountInformation>((resolve, reject) => {
    var queryString = 'recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date());
    var signature = helpers.generateHmac(queryString, secretKey);
    request({
      url: BASE_ENDPOINT + URL_ACCOUNT_INFORMATION + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": apiKey
      },
      json: true
    }, function (error, response, body) {
      debug('getAccountInformation [' + JSON.stringify(body) + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getAccountInformation!');
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-trade-list-user_data
 * Get trades for a specific account and symbol.
 * Weight: 5 with symbol
 */
let getAccountTradeList = async function (_symbol: string, _startTime: any, _endTime: any) {
  return new Promise((resolve, reject) => {
    var queryString = 'recvWindow=' + DEFAULT_RECV_WINDOW + '&timestamp=' + (+ new Date()) + '&symbol=' + _symbol;
    if (_startTime != undefined && _endTime != undefined) {
      queryString += '&startTime=' + _startTime + '&endTime=' + _endTime;
    }
    var signature = helpers.generateHmac(queryString, nconf.get('binance:secret_key'));
    request({
      url: BASE_ENDPOINT + URL_ACCOUNT_TRADE_LIST + '?' + queryString + '&signature=' + signature,
      headers: {
        "content-type": "application/json",
        "X-MBX-APIKEY": nconf.get('binance:api_key')
      },
      json: true
    }, function (error, response, body) {
      debug('getAccountTradeList [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getAccountTradeList!');
      } else {
        resolve(body);
      }
    });
  });
}

export {
  getOrderBook,
  getKLineCandlestickData,
  getSymbolOrderBookTicker,
  newOrder,
  testNewOrder,
  queryOrder,
  cancelOrder,
  getCurrentOpenOrders,
  getAllOrders,
  getAccountInformation,
  getAccountTradeList
}