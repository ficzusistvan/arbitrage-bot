// GENERAL DEPENDENCIES
import request from 'request'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});

// DEBUGGING
import Debug from 'debug'
const debug = Debug('rest-api-kucoin')

// ARBITER DEPENDENCIES
import * as helpers from './helpers'

// KUCOIN
import * as i from './interfaces'

// VARIABLES
const BASE_ENDPOINT = 'https://api.kucoin.com';
const URL_FULL_ORDER_BOOK         = '/api/v2/market/orderbook/level2';
/** Security Type	NONE: Endpoint can be accessed freely. */
const URL_WEBSOCKET_FEED_CONNECT_TOKEN_PUBLIC = '/api/v1/bullet-public';

let getWsConnectTokenPublic = async function () {
  return new Promise<any>((resolve, reject) => {
    request({
      method: 'POST',
      url: BASE_ENDPOINT + URL_WEBSOCKET_FEED_CONNECT_TOKEN_PUBLIC,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getWsConnectTokenPublic [' + JSON.stringify(body) + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getWsConnectTokenPublic!');
      } else {
        resolve(body);
      }
    });
  });
}

let getFullOrderBook = async function(_symbol: string) {
  return new Promise<i.ISnapshotExt>((resolve, reject) => {
    const queryString = '?symbol=' + _symbol;
    request({
      url: BASE_ENDPOINT + URL_FULL_ORDER_BOOK + queryString,
      headers: {
        "content-type": "application/json",
      },
      json: true
    }, function (error, response, body) {
      debug('getFullOrderBook [' + body + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getFullOrderBook!');
      } else {
        resolve(body);
      }
    });
  });
}

let getFees = async function (apiKey: string, secret: string, passPhrase: string) {
  return new Promise<i.IFees>((resolve, reject) => {
    resolve({ maker: Big(0.01), taker: Big(0.01) });
  });
}

export {
  getWsConnectTokenPublic,
  getFullOrderBook,
  getFees
}