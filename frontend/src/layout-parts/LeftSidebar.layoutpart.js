import React from 'react';
import CoinMarketCapWidgetComponent from '../components/CoinMarketCapWidget.component';
import translate from 'redux-polyglot/translate';

const LeftSidebarLayoutPart = () => (
  <>
    <CoinMarketCapWidgetComponent currencyId="1" />
    <CoinMarketCapWidgetComponent currencyId="1027" />
    <CoinMarketCapWidgetComponent currencyId="52" />
  </>
)

export default translate(LeftSidebarLayoutPart);