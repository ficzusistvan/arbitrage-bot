// GENERAL DEPENDENCIES
import WebSocket from 'ws'
import Big from 'big.js'

// DEBUGGING
import Debug from 'debug'
const debug = Debug('exchange-binance')

// ARBITER DEPENDENCIES
import { logger } from '../../logger'
import * as eventHandler from '../../event-handler'
import * as gi from '../interfaces'

// BINANCE
import * as restApi from './rest-api'
import * as webSocketStreams from './web-socket-streams'
import * as helpers from './helpers'
import * as orderBookHandler from './order-book-handler'
import * as i from './interfaces'

// VARIABLES
const ONE_HUNDRED = Big(100);
const ORDER_BOOK_LIMIT = 1000;
let pingTimeout: NodeJS.Timeout;
let isSnapshotRequested: boolean = false;
let isSnapshotReceived: boolean = false;

function heartbeatKLine(ws: WebSocket, timeoutPing: number) {
  clearTimeout(pingTimeout);

  // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
  // equal to the interval at which your server sends out pings plus a
  // conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    logger.info('Terminating KLine ws for [' + i.BINANCE + '] ...');
    ws.terminate();
  }, timeoutPing); // 3 minutes + 30 seconds
}

let startBidAskStreaming = async function (pair: gi.IPair, timeoutRestart: number, timeoutPing: number) {
  const addr: string = webSocketStreams.buildWsAddress(webSocketStreams.DiffDepthStream, pair.symbol.toLowerCase(), null);
  let ws: WebSocket = new WebSocket(addr);

  ws.addEventListener('open', () => {
    logger.info('Kline web socket opened for [' + i.BINANCE + ' ' + pair.symbol + ']');
    heartbeatKLine(ws, timeoutPing);
  });
  ws.addEventListener('message', async (msg) => {
    const data = JSON.parse(msg.data);
    const l2update: i.IL2updateInt = helpers.getL2Update(data);
    debug('ws message l2update', l2update);
    if (isSnapshotReceived) {
      orderBookHandler.update(l2update);
    } else {
      orderBookHandler.cache(l2update);
    }
    if (!isSnapshotRequested) {
      isSnapshotRequested = true;
      const snapshotExt: i.ISnapshotExt = await restApi.getOrderBook(pair.symbol, ORDER_BOOK_LIMIT);
      const snapshotInt: i.ISnapshotInt = helpers.getSnapshot(snapshotExt);
      orderBookHandler.init(snapshotInt);
      isSnapshotReceived = true;
    }
  });
  ws.addEventListener('close', () => {
    logger.info('Kline ws closed for [' + i.BINANCE + ' ' + pair.symbol + ']');
    eventHandler.em.emit(eventHandler.WEBSOCKET_DISCONNECTED, i.BINANCE);
    clearTimeout(pingTimeout);
    setTimeout(function () { // restart connection after 5s
      startBidAskStreaming(pair, timeoutRestart, timeoutPing);
    }, timeoutRestart);
  });
  ws.addEventListener('ping', () => {
    debug('Kline ping received! [' + i.BINANCE + ' ' + pair.symbol + ']');
    heartbeatKLine(ws, timeoutPing);
  });
  ws.addEventListener('error', (error) => {
    logger.error('Kline ws error for [' + i.BINANCE + ' ' + pair.symbol + ']', error);
    clearTimeout(pingTimeout);
  });
}

let notifyBotIsIdle = function () {
}

let getFees = function (apiKey: string, secretKey: string): Promise<gi.IFees> {
  const fees = restApi.getAccountInformation(apiKey, secretKey).then(res => {
    const accountInfo: i.IAccountInformation = res;
    // Make sure fees are in percent!!!
    return { maker: Big(accountInfo.makerCommission).div(ONE_HUNDRED), taker: Big(accountInfo.takerCommission).div(ONE_HUNDRED) };
  });
  return fees;
}

export {
  startBidAskStreaming,
  notifyBotIsIdle,
  getFees
}