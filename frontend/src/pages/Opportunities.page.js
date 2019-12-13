import React from "react";
import { Jumbotron } from 'reactstrap';
import OpportunitiesComponent from '../components/Opportunities.component';
import translate from 'redux-polyglot/translate';
import ExchangesComponent from '../components/Exchanges.component';
import CurrencyPairComponent from "../components/CurrencyPair.component";

const OpportunitiesPage = (props) => (
  <Jumbotron>
    <ExchangesComponent />
    <CurrencyPairComponent />
    <OpportunitiesComponent />
  </Jumbotron>
);

export default translate(OpportunitiesPage);