import crypto from 'crypto'
import moment from 'moment'
import Big from 'big.js'
import { ISnapshotExt, ISnapshotInt, IL2updateExt, IL2updateInt } from './interfaces'

let generateHmac = function (data: any, key: string) {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

export const IDX_OPEN_TIME = 0
export const IDX_OPEN = 1
export const IDX_HIGH = 2
export const IDX_LOW = 3
export const IDX_CLOSE = 4
export const IDX_VOLUME = 5
export const IDX_CLOSE_TIME = 6
export const IDX_QAV = 7
export const IDX_NR_OF_TRADES = 8
export const IDX_TBBAV = 9
export const IDX_TBQAV = 10
export const IDX_IGNORE = 11

let mapCandlestickObject2Array = function (obj: any) {
  var arr = [];
  arr.push(obj.k.t);
  arr.push(obj.k.o);
  arr.push(obj.k.h);
  arr.push(obj.k.l);
  arr.push(obj.k.c);
  arr.push(obj.k.v);
  arr.push(obj.k.T);
  arr.push(obj.k.q);
  arr.push(obj.k.t);
  arr.push(obj.k.V);
  arr.push(obj.k.Q);
  arr.push(obj.k.B);
  return arr;
}

interface IKLine {
  t: number, // Kline start time
  T: number, // Kline close time
  s: string,  // Symbol
  i: string,      // Interval
  f: number,       // First trade ID
  L: number,       // Last trade ID
  o: string,  // Open price
  c: string,  // Close price
  h: string,  // High price
  l: string,  // Low price
  v: string,    // Base asset volume
  n: number,       // Number of trades
  x: boolean,     // Is this kline closed?
  q: string,  // Quote asset volume
  V: string,     // Taker buy base asset volume
  Q: string,   // Taker buy quote asset volume
  B: string   // Ignore
}

interface IKlineCandlestickStreams {
  e: string,     // Event type
  E: number,   // Event time
  s: string,    // Symbol
  k: IKLine
}

let getPriceFromObj = function (obj: IKlineCandlestickStreams) {
  return {
    timestamp: moment(obj.E),
    price: obj.k.c
  }
}

interface IPartialBookDepthStreams {
  lastUpdateId: number;
  bids: Array<Array<number>>;
  asks: Array<Array<number>>;
}

let getBidAsk = function (obj: IPartialBookDepthStreams) {
  return {
    timestamp: moment(),
    bid: obj.bids[0][0],
    ask: obj.asks[0][0]
  }
}

let createOHLCVObjFromArr = function (arr: any) {
  return {
    timestamp: arr[module.exports.IDX_OPEN_TIME],
    startTime: arr[module.exports.IDX_OPEN_TIME],
    closeTime: arr[module.exports.IDX_CLOSE_TIME],
    open: arr[module.exports.IDX_OPEN],
    high: arr[module.exports.IDX_HIGH],
    low: arr[module.exports.IDX_LOW],
    close: arr[module.exports.IDX_CLOSE],
    volume: arr[module.exports.IDX_VOLUME]
  }
}

let getSnapshot = function (obj: ISnapshotExt): ISnapshotInt {
  return {
    sequence: obj.lastUpdateId,
    bids: obj.bids.map(bid => {
      return [Big(bid[0]), Big(bid[1])];
    }),
    asks: obj.asks.map(ask => {
      return [Big(ask[0]), Big(ask[1])];
    })
  }
}

let getL2Update = function (obj: IL2updateExt): IL2updateInt {
  return {
    sequenceStart: obj.U,
    sequenceEnd: obj.u,
    changes: {
      asks: obj.a.map(ask => {
        return [Big(ask[0]), Big(ask[1])];
      }),
      bids: obj.b.map(bid => {
        return [Big(bid[0]), Big(bid[1])];
      })
    }
  }
}

export {
  generateHmac,
  mapCandlestickObject2Array,
  getPriceFromObj,
  getBidAsk,
  createOHLCVObjFromArr,
  getSnapshot,
  getL2Update
}