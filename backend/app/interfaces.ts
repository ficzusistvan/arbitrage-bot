import Big from "big.js";
import moment = require("moment");

export interface IExchange {
  name: string,
  fixed_length_name: string,
  api_key: string,
  secret_key: string,
  passphrase?: string,
  ws_timeout_ms: {
    ping: number,
    restart: number
  },
  symbol: string,
  base_asset: string,
  quote_asset: string,
  min_trade_amount: number
}

export enum EDirection {
  none = 'None',
  buyFromRefSellOnOther = 'Buy from exchange1, sell on exchange2',
  sellFromRefBuyOnOther = 'Sell from exchange1, buy on exchange2'
}

interface IPair {
  price: Big,
  size: Big
}

export interface IProfitability {
  direction: EDirection,
  askPair: IPair,
  bidPair: IPair,
  possibleProfit: Big,
  profitability: Big,
  profitCurrency: string
}

export interface ISnapshotEntry {
  direction: EDirection,
  askPrice: Big,
  bidPrice: Big,
  dt_server: moment.Moment
}

export enum TradeType {
  Buy,
  Sell
}

export interface IRedisTradeHistoryEntry {
  tradeType: TradeType,
  exchange1: string,
  exchange2: string,
  exchange1Price: Big,
  exchange2Price: Big
}