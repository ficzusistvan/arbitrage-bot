import Big from 'big.js'

export const BINANCE = 'binance';

export interface ISnapshotExt {
  lastUpdateId: number,
  bids: Array<[string, string]>, // price, quantity
  asks: Array<[string, string]> // price, quantity
}

export interface ISnapshotInt {
  sequence: number,
  bids: Array<[Big, Big]>, // price, size
  asks: Array<[Big, Big]> // price, size
}

export interface IL2updateExt {
  e: string, // Event type
  E: number, // Event time
  s: string, // Symbol
  U: number, // First update ID in event
  u: number, // Final update ID in event
  b: Array<[string, string]>, // price, quantity
  a: Array<[string, string]> // price, quantity
}

export interface IL2updateInt {
  sequenceStart: number,
  sequenceEnd: number,
  changes: {
    asks: Array<[Big, Big]>, // price, quantity
    bids: Array<[Big, Big]> // price, quantity
  }
}

export interface iBalance {
  asset: string;
  free: number;
  locked: number;
}

export interface IAccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  balances: Array<iBalance>;
}