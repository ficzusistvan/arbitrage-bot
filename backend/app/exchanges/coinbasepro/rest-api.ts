// GENERAL DEPENDENCIES
import request from 'request'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});

// DEBUGGING
import Debug from 'debug'
const debug = Debug('rest-api-coinbasepro')

// ARBITER DEPENDENCIES
import * as helpers from './helpers'

// COINBASEPRO
import * as i from './interfaces'

// VARIABLES
const BASE_ENDPOINT = 'https://api.pro.coinbase.com';
const URL_FEES      = '/fees';

const HEDAER_CB_ACCESS_KEY = "CB-ACCESS-KEY";               // The api key as a string.
const HEDAER_CB_ACCESS_SIGN = "CB-ACCESS-SIGN";             // The base64-encoded signature (see Signing a Message).
const HEDAER_CB_ACCESS_TIMESTAMP = "CB-ACCESS-TIMESTAMP";   // A timestamp for your request.
const HEDAER_CB_ACCESS_PASSPHRASE = "CB-ACCESS-PASSPHRASE"; // The passphrase you specified when creating the API key.

/**
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-information-user_data
 * Get current account information.
 * Weight: 5
 */
let getFees = async function (apiKey: string, secret: string, passPhrase: string) {
  const timestamp = Date.now() / 1000;
  // create the prehash string by concatenating required parts
  const messageToSign = timestamp + 'GET' + URL_FEES;
  // decode the base64 secret
  const key = Buffer.from(secret, 'base64');
  const signedMessage = helpers.signMessage(messageToSign, key);
  return new Promise<i.IFees>((resolve, reject) => {
    request({
      url: BASE_ENDPOINT + URL_FEES,
      headers: {
        "content-type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        "CB-ACCESS-KEY": apiKey,
        "CB-ACCESS-SIGN": signedMessage,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-ACCESS-PASSPHRASE": passPhrase
      },
      json: true
    }, function (error, response, body) {
      debug('getFees [' + JSON.stringify(body) + ']');
      if (error || (response && response.statusCode !== 200)) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        reject('Failed to getFees!');
      } else {
        resolve(body);
      }
    });
  });
}

export {
  getFees,
}