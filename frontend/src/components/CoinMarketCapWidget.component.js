import React from "react";
import translate from 'redux-polyglot/translate';
import { Helmet } from 'react-helmet';

const CoinMarketCapWidgetComponent = (props) => (
  <>
    <Helmet>
      <script type="text/javascript" src="https://files.coinmarketcap.com/static/widget/currency.js">
      </script>
    </Helmet>
    <div className="coinmarketcap-currency-widget" data-currencyid={props.currencyId} data-base="USD" data-secondary="" data-ticker="true" data-rank="true" data-marketcap="true" data-volume="true" data-statsticker="true" data-stats="USD"></div>
  </>
);

export default translate(CoinMarketCapWidgetComponent);