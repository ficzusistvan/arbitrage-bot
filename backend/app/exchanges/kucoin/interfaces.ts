import Big from 'big.js';

export const KUCOIN = 'kucoin';

export interface ISnapshotExt {
  code: number,
  data: {
    sequence: number,
    bids: Array<[string, string]>, // price, size
    asks: Array<[string, string]> // price, size
  }
}

export interface ISnapshotInt {
  sequence: number,
  bids: Array<[Big, Big]>, // price, size
  asks: Array<[Big, Big]> // price, size
}

export interface IL2updateExt {
  type: string,
  topic: string,
  subject: string,
  data: {
    sequenceStart: number,
    sequenceEnd: number,
    symbol: string,
    changes: {
      asks: Array<[string, string, string]>, // price, size, sequence
      bids: Array<[string, string, string]> // price, size, sequence
    }
  }
}

export interface IL2updateInt {
  sequenceStart: number,
  sequenceEnd: number,
  changes: {
    asks: Array<[Big, Big, number]>, // price, size, sequence
    bids: Array<[Big, Big, number]> // price, size, sequence
  }
}

export interface IFees {
  maker: Big,
  taker: Big
}