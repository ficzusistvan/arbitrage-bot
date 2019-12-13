import React from "react";
import { Jumbotron } from 'reactstrap';
import OrderBookComponent from '../components/OrderBook.component';
import translate from 'redux-polyglot/translate';

const OrderbooksPage = (props) => (
  <Jumbotron>
    <OrderBookComponent />
  </Jumbotron>
);

export default translate(OrderbooksPage);