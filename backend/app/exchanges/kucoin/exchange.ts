// GENERAL DEPENDENCIES
import WebSocket from 'ws'
import Big from 'big.js'

// DEBUGGING
import Debug from 'debug'
const debug = Debug('exchange-kucoin')

// ARBITER DEPENDENCIES
import { logger } from '../../logger'
import * as eventHandler from '../../event-handler'
import * as gi from '../interfaces'

// KUCOIN
import * as restApi from './rest-api'
import * as webSocketStreams from './web-socket-streams'
import * as helpers from './helpers'
import * as orderBookHandler from './order-book-handler'
import * as i from './interfaces'

// VARIABLES
let pingTimeout: NodeJS.Timeout;
let isSnapshotRequested: boolean = false;
let isSnapshotReceived: boolean = false;

function heartbeatKLine(ws: any, timeoutPing: number) {
  clearTimeout(pingTimeout);

  // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
  // equal to the interval at which your server sends out pings plus a
  // conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    logger.info('Terminating KLine ws for [' + i.KUCOIN + '] ...');
    ws.terminate();
  }, timeoutPing); // 3 minutes + 30 seconds
}

let startBidAskStreaming = async function (pair: gi.IPair, timeoutRestart: number, timeoutPing: number) {
  const resp = await restApi.getWsConnectTokenPublic();
  const endpoint = resp.data.instanceServers[0].endpoint;
  const token = resp.data.token;
  const connectId = "my-conn-id";
  const addr = endpoint + '?token=' + token + '&[connectId=' + connectId + ']&acceptUserMessage=true';
  let ws = new WebSocket(addr);
  const symbol = pair.baseAsset + '-' + pair.quoteAsset;

  ws.addEventListener('open', () => {
    logger.info('Kline web socket opened for [' + i.KUCOIN + ' ' + pair.symbol + ']');
    heartbeatKLine(ws, timeoutPing);
    const message = { id: connectId, type: "subscribe", topic: "/market/level2:" + symbol, privateChannel: false, response: true };
    ws.send(JSON.stringify(message));
    setInterval(function () { // send ping message every 10 s
      const ping = { type: "ping", id: connectId };
      ws.send(JSON.stringify(ping));
    }, 10 * 1000);
  });
  ws.addEventListener('message', async (msg) => {
    const data = JSON.parse(msg.data);
    if (data.topic && data.topic.startsWith('/market/level2:')) {
      const l2update = helpers.getL2Update(data);
      debug('ws message l2update', l2update);
      if (isSnapshotReceived) {
        orderBookHandler.update(l2update);
      } else {
        orderBookHandler.cache(l2update);
      }
      if (!isSnapshotRequested) {
        isSnapshotRequested = true;
        const snapshotExt: i.ISnapshotExt = await restApi.getFullOrderBook(symbol);
        const snapshotInt = helpers.getSnapshot(snapshotExt);
        orderBookHandler.init(snapshotInt);
        isSnapshotReceived = true;
      }
    }
  });
  ws.addEventListener('close', () => {
    logger.info('Kline ws closed for [' + i.KUCOIN + ' ' + pair.symbol + ']');
    eventHandler.em.emit(eventHandler.WEBSOCKET_DISCONNECTED, i.KUCOIN);
    clearTimeout(pingTimeout);
    setTimeout(function () { // restart connection after 5s
      startBidAskStreaming(pair, timeoutRestart, timeoutPing);
    }, timeoutRestart);
  });
  ws.addEventListener('ping', () => {
    debug('Kline ping received! [' + i.KUCOIN + ' ' + pair.symbol + ']');
    heartbeatKLine(ws, timeoutPing);
  });
  ws.addEventListener('error', (error) => {
    logger.error('Kline ws error for [' + i.KUCOIN + ' ' + pair.symbol + ']', error);
    clearTimeout(pingTimeout);
  });
}

let notifyBotIsIdle = function () {
}

let getFees = function (apiKey: string, secretKey: string): Promise<gi.IFees> {
  const fees = restApi.getFees(apiKey, secretKey, '').then(res => {
    const feeRates: i.IFees = res;
    // Make sure fees are in percent!!!
    return { maker: Big(feeRates.maker), taker: Big(feeRates.taker) };
  });
  return fees;
}

export {
  startBidAskStreaming,
  notifyBotIsIdle,
  getFees
}