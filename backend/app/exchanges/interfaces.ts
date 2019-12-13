import Big from 'big.js'
import moment = require('moment');

export interface IPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export enum EOrder {
  Asc,
  Desc
}

export interface IBestPrices {
  ask: Big;
  bid: Big;
}

export interface IPriceSize {
  price: Big,
  size: Big
}

export interface IOBData {
  askPrice: Big;
  askQuantity: Big;
  bidPrice: Big;
  bidQuantity: Big;
  updatedAt: moment.Moment;
}

export interface IExchangeOBData {
  exchange: string;
  obData: IOBData;
}

export interface ISnapshot {
  exchange: string,
  bids: Array<[Big, Big]>, // price, size
  asks: Array<[Big, Big]> // price, size
}

export interface IFees {
  maker: Big,
  taker: Big
}