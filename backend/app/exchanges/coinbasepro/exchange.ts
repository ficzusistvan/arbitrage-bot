// GENERAL DEPENDENCIES
import WebSocket from 'ws'
import Big from 'big.js'

// DEBUGGING
import Debug from 'debug'
const debug = Debug('exchange-coinbasepro')

// ARBITER DEPENDENCIES
import { logger } from '../../logger'
import * as eventHandler from '../../event-handler'
import * as gi from '../interfaces'

// COINBASEPRO
import * as restApi from './rest-api'
import * as webSocketStreams from './web-socket-streams'
import * as helpers from './helpers'
import * as orderBookHandler from './order-book-handler'
import * as i from './interfaces'

// VARIABLES
const ONE_HUNDRED = Big(100);
let pingTimeout: NodeJS.Timeout;

function heartbeat(ws: any, timeoutPing: number) {
  clearTimeout(pingTimeout);

  // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
  // equal to the interval at which your server sends out pings plus a
  // conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    logger.info('Terminating KLine ws for [' + i.COINBASEPRO + '] ...');
    ws.terminate();
  }, timeoutPing); // 3 minutes + 30 seconds
}

let startBidAskStreaming = function (pair: gi.IPair, timeoutRestart: number, timeoutPing: number) {
  const addr = webSocketStreams.ENDPOINT;
  let ws = new WebSocket(addr);

  ws.addEventListener('open', () => {
    logger.info('Kline web socket opened for [' + i.COINBASEPRO + ' ' + pair.symbol + ']');
    heartbeat(ws, timeoutPing);
    const message = { type: "subscribe", channels: ["level2"], product_ids: [pair.baseAsset + '-' + pair.quoteAsset] };
    ws.send(JSON.stringify(message));
  });
  ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === 'snapshot') {
      const snapshot: i.ISnapshotInt = helpers.getSnapshot(data);
      debug('ws message snapshot', snapshot);
      orderBookHandler.init(snapshot);
    } else
      if (data.type === 'l2update') {
        const l2update: i.IL2updateInt = helpers.getL2Update(data);
        debug('ws message l2update', l2update);
        orderBookHandler.update(l2update);
      } else {
        /** Ignore */
      }
  });
  ws.addEventListener('close', () => {
    logger.info('Kline ws closed for [' + i.COINBASEPRO + ' ' + pair.symbol + ']');
    eventHandler.em.emit(eventHandler.WEBSOCKET_DISCONNECTED, i.COINBASEPRO);
    clearTimeout(pingTimeout);
    setTimeout(function () { // restart connection after 5s
      startBidAskStreaming(pair, timeoutRestart, timeoutPing);
    }, timeoutRestart);
  });
  ws.addEventListener('ping', () => {
    debug('Kline ping received! [' + i.COINBASEPRO + ' ' + pair.symbol + ']');
    heartbeat(ws, timeoutPing);
  });
  ws.addEventListener('error', (error) => {
    logger.error('Kline ws error for [' + i.COINBASEPRO + ' ' + pair.symbol + ']', error);
    clearTimeout(pingTimeout);
  });
}

let notifyBotIsIdle = function () {
}

let getFees = function (apiKey: string, secret: string, passPhrase: string): Promise<gi.IFees> {
  const fees = restApi.getFees(apiKey, secret, passPhrase).then(res => {
    const feeRates: i.IFees = res;
    // Make sure fees are in percent!!!
    return { maker: Big(feeRates.maker_fee_rate), taker: Big(feeRates.taker_fee_rate) };
  });
  return fees;
}

export {
  startBidAskStreaming,
  notifyBotIsIdle,
  getFees
}