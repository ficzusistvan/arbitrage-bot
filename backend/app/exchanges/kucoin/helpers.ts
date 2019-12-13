import Big from 'big.js';
import { ISnapshotExt, ISnapshotInt, IL2updateExt, IL2updateInt } from './interfaces'

let getSnapshot = function (obj: ISnapshotExt): ISnapshotInt {
  return {
    sequence: obj.data.sequence,
    bids: obj.data.bids.map(bid => {
      return [Big(bid[0]), Big(bid[1])];
    }),
    asks: obj.data.asks.map(ask => {
      return [Big(ask[0]), Big(ask[1])];
    })
  }
}

let getL2Update = function (obj: IL2updateExt): IL2updateInt {
  return {
    sequenceStart: obj.data.sequenceStart,
    sequenceEnd: obj.data.sequenceEnd,  
    changes: {
      asks: obj.data.changes.asks.map(item => {
        return [Big(item[0]), Big(item[1]), Number(item[2])];
      }),
      bids: obj.data.changes.bids.map(item => {
        return [Big(item[0]), Big(item[1]), Number(item[2])];
      })
    }
  }
}

export {
  getSnapshot,
  getL2Update
}