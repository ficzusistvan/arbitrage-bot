import Big from 'big.js';

export const COINBASEPRO = 'coinbasepro';

export interface ISnapshotExt {
  type: string,
  product_id: string,
  bids: Array<[string, string]>,
  asks: Array<[string, string]>
}

export interface ISnapshotInt {
  bids: Array<[Big, Big]>,
  asks: Array<[Big, Big]>
}

export interface IL2updateExt {
  type: string,
  product_id: string,
  time: Date,
  changes: Array<[string, string, string]> // side, price, size
}

export interface IL2updateInt {
  time: Date,
  changes: Array<[string, Big, Big]>
}

export interface IFees {
  maker_fee_rate: Big,
  taker_fee_rate: Big,
  usd_volume: Big
}