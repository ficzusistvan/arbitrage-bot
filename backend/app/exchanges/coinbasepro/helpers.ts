import Big from 'big.js';
import crypto from 'crypto'
import { ISnapshotExt, ISnapshotInt, IL2updateExt, IL2updateInt } from './interfaces'

let getSnapshot = function (obj: ISnapshotExt): ISnapshotInt {
  return {
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
    time: obj.time,
    changes: obj.changes.map(item => {
      return [item[0], Big(item[1]), Big(item[2])];
    })
  }
}

let signMessage = function (data: any, key: Buffer) {
  return crypto.createHmac('sha256', key).update(data).digest('base64');
}

export {
  getSnapshot,
  getL2Update,
  signMessage
}