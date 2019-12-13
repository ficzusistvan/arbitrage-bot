import shortid from 'shortid'

export const MODE_BACKTESTING = 'backtesting';
export const MODE_PAPERTRADING = 'papertrading';
export const MODE_REAL = 'real';

export const ORDER_TYPE_LMIT = 'LIMIT'; // Limit order sets the maximum or minimum price at which you are willing to buy or sell.
export const ORDER_TYPE_MARKET = 'MARKET'; // Market orders are transactions meant to execute as quickly as possible at the present or market price.
export const ORDER_TYPE_STOP_LOSS = 'STOP_LOSS';
export const ORDER_TYPE_STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT';
export const ORDER_TYPE_TAKE_PROFIT = 'TAKE_PROFIT';
export const ORDER_TYPE_TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT';
export const ORDER_TYPE_LIMIT_MAKER = 'LIMIT_MAKER';

export const ORDER_STATUS_NEW = 'NEW';
export const ORDER_STATUS_PARTIALLY_FILLED = 'PARTIALLY_FILLED';
export const ORDER_STATUS_FILLED = 'FILLED';
export const ORDER_STATUS_CANCELED = 'CANCELED';
export const ORDER_STATUS_PENDING_CANCEL = 'PENDING_CANCEL'; // (currently unused)
export const ORDER_STATUS_REJECTED = 'REJECTED';
export const ORDER_STATUS_EXPIRED = 'EXPIRED';

export const SIDE_BUY = 'BUY';
export const SIDE_SELL = 'SELL';

export const TIME_IN_FORCE_GTC = 'GTC'; // (Good-Til-Canceled) orders are effective until they are executed or canceled.
export const TIME_IN_FORCE_IOC = 'IOC'; // (Immediate or Cancel) orders fills all or part of an order immediately and cancels the remaining part of the order.
export const TIME_IN_FORCE_FOK = 'FOK'; // (Fill or Kill) orders fills all in its entirety, otherwise, the entire order will be cancelled.

export const SUPPORTED_INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];

let simulateNewOrder = function (_symbol: string, _side: string, _type: string, _quantity: number, /* OPTIONALS */ _timeInForce: any, _price: any, _stopPrice: any, _icebergQty: any) {
  // Simulate that the order is already 100% filled...
  return {
    clientOrderId: shortid.generate(),
    cummulativeQuoteQty: _quantity * _price,
    executedQty: _quantity,
    icebergQty: _icebergQty,
    isWorking: true,
    origQty: _quantity,
    price: _price,
    side: _side,
    status: module.exports.ORDER_STATUS_FILLED,
    stopPrice: _stopPrice,
    symbol: _symbol,
    time: (+new Date()),
    timeInForce: _timeInForce,
    type: _type,
    updateTime: (+new Date())
  };
}

function combine(exchange: string, symbol: string) {
  return (exchange + '_' + symbol);
}

export {
  simulateNewOrder,
  combine
}