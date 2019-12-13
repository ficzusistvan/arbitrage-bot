// GENERAL DEPENDENCIES
import Big from "big.js"

// DEBUGGING
import Debug from "debug"
const debug = Debug('utils')

// ARBITER DEPENDENCIES
import * as ei from './exchanges/interfaces'
import * as gi from './interfaces'

// VARIABLES
const ONE_HUNDRED = Big(100);
const TOFIXED_PRICE = 6;
const TOFIXED_SIZE = 4;

function getProfitability(e1OBData: ei.IOBData, e2OBData: ei.IOBData, e1Fees: ei.IFees, e2Fees: ei.IFees, e1Cfg: gi.IExchange, e2Cfg: gi.IExchange): gi.IProfitability {
  debug('*********************************************************');
  let result: gi.IProfitability = { 
    direction: gi.EDirection.none,
    askPair: { price: Big(0), size: Big(0) },
    bidPair: { price: Big(0), size: Big(0) },
    possibleProfit: Big(0),
    profitability: Big(0),
    profitCurrency: ''
  };
  // case 1: Buy from reference exchange, sell on the other exchange
  const diffCase1: Big = e2OBData.bidPrice.minus(e1OBData.askPrice);
  // case 2: Sell on reference exchange, buy from the other exchange
  const diffCase2: Big = e1OBData.bidPrice.minus(e2OBData.askPrice);
  debug('diffCase1 [%s] vs. diffCase2 [%s]', diffCase1.toFixed(TOFIXED_PRICE), diffCase2.toFixed(TOFIXED_PRICE));
  // decide which case has bigger profitability (if any)
  if (diffCase1.gt(diffCase2)) {
    debug('Handling diffCase1 %s', diffCase1.toFixed(TOFIXED_PRICE));
    if (diffCase1.gt(0)) {
      // Buying from exchange1, selling on exchange2
      // TODO: we are the market makers?!
      // Step 1: decide lower trade size
      const tradeSize: Big = e1OBData.askQuantity.lt(e2OBData.bidQuantity) ? e1OBData.askQuantity : e2OBData.bidQuantity;
      debug('Trade size %s; %s vs %s', tradeSize.toFixed(TOFIXED_SIZE), e1OBData.askQuantity.toFixed(TOFIXED_SIZE), e2OBData.bidQuantity.toFixed(TOFIXED_SIZE));
      // Step 2: calculate total spent amount including fee
      // 2.1 calculate spent amount
      const spent: Big = e1OBData.askPrice.mul(tradeSize);
      debug('Spent %s', spent.toFixed(TOFIXED_PRICE));
      // 2.2 calculate fee
      const e1Fee: Big = spent.mul(e1Fees.maker).div(ONE_HUNDRED);
      debug('Additional fee %s', e1Fee.toFixed(TOFIXED_PRICE));
      // 2.3 calculate total spent amount
      const totalSpent: Big = spent.plus(e1Fee);
      debug('Total spent %s', totalSpent.toFixed(TOFIXED_PRICE));

      // Step 3: calculate total earned mount subtracting fee
      // 3.1 calculate earned amount
      const earned: Big = e2OBData.bidPrice.mul(tradeSize);
      debug('Earned %s', earned.toFixed(TOFIXED_PRICE));
      // 3.2 calculate fee
      const e2Fee: Big = earned.mul(e2Fees.maker).div(ONE_HUNDRED);
      debug('Subtracting fee %s', e2Fee.toFixed(TOFIXED_PRICE));
      // 3.3 calculate total earned amount
      const totalEarned: Big = earned.minus(e2Fee);
      debug('Total earned %s', totalEarned.toFixed(TOFIXED_PRICE));

      // Step 4: calculate profit
      result.possibleProfit = totalEarned.minus(totalSpent);
      debug('Possible profit %s %s', result.possibleProfit.toFixed(TOFIXED_PRICE), e1Cfg.quote_asset);

      // Step 5: calculate profitability
      result.profitability = e2OBData.bidPrice.plus(result.possibleProfit).mul(ONE_HUNDRED).div(e2OBData.bidPrice).minus(ONE_HUNDRED);
      debug('Profitability %s', result.profitability.toFixed(TOFIXED_PRICE));

      result.direction = gi.EDirection.buyFromRefSellOnOther;
      debug('direction %s', result.direction);
      result.askPair = { price: e1OBData.askPrice, size: e1OBData.askQuantity };
      result.bidPair = { price: e2OBData.bidPrice, size: e2OBData.bidQuantity };
      result.profitCurrency = e1Cfg.quote_asset;
    } else {
      debug('Skipping... diffCase1 is less then 0');
    }
  } else {
    debug('Handling diffCase2 %s', diffCase2.toFixed(TOFIXED_PRICE));
    if (diffCase2.gt(0)) {
      // Buying from exchange2, selling on exchange1
      // TODO: we are the market makers?!
      // Step 1: decide lower trade size
      const tradeSize: Big = e2OBData.askQuantity.lt(e1OBData.bidQuantity) ? e2OBData.askQuantity : e1OBData.bidQuantity;
      debug('Trade size %s; %s vs %s', tradeSize.toFixed(TOFIXED_SIZE), e2OBData.askQuantity.toFixed(TOFIXED_SIZE), e1OBData.bidQuantity.toFixed(TOFIXED_SIZE));
      // Step 2: calculate total spent amount including fee
      // 2.1 calculate spent amount
      const spent: Big = e2OBData.askPrice.mul(tradeSize);
      debug('Spent %s', spent.toFixed(TOFIXED_PRICE));
      // 2.2 calculate fee
      const e2Fee: Big = spent.mul(e2Fees.maker).div(ONE_HUNDRED);
      debug('Trade fee %s', e2Fee.toFixed(TOFIXED_PRICE));
      // 2.3 calculate total spent amount
      const totalSpent: Big = spent.plus(e2Fee);
      debug('Total spent %s', totalSpent.toFixed(TOFIXED_PRICE));

      // Step 3: calculate total earned mount subtracting fee
      // 3.1 calculate earned amount
      const earned: Big = e1OBData.bidPrice.mul(tradeSize);
      debug('Earned %s', earned.toFixed(TOFIXED_PRICE));
      // 3.2 calculate fee
      const e1Fee: Big = earned.mul(e1Fees.maker).div(ONE_HUNDRED);
      debug('Trade fee %s', e1Fee.toFixed(TOFIXED_PRICE));
      // 3.3 calculate total earned amount
      const totalEarned: Big = earned.minus(e1Fee);
      debug('Total earned %s', totalEarned.toFixed(TOFIXED_PRICE));

      // Step 4: calculate profit
      result.possibleProfit = totalEarned.minus(totalSpent);
      debug('Possible profit %s %s', result.possibleProfit.toFixed(TOFIXED_PRICE), e2Cfg.quote_asset);

      // Step 5: calculate profitability
      result.profitability = e1OBData.bidPrice.plus(result.possibleProfit).mul(ONE_HUNDRED).div(e1OBData.bidPrice).minus(ONE_HUNDRED);
      debug('Profitability %s', result.profitability.toFixed(TOFIXED_PRICE));

      result.direction = gi.EDirection.sellFromRefBuyOnOther;
      debug('direction %s', result.direction);
      result.askPair = { price: e2OBData.askPrice, size: e2OBData.askQuantity };
      result.bidPair = { price: e1OBData.bidPrice, size: e1OBData.bidQuantity };
      result.profitCurrency = e2Cfg.quote_asset;
    } else {
      debug('Skipping... diffCase2 is less then 0');
    }
  }

  return result;
}

export {
  getProfitability
}