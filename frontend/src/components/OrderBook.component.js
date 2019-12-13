import React, { Component } from 'react'
import "react-table/react-table.css";
import translate from 'redux-polyglot/translate';
import socketIOClient from 'socket.io-client';
import { AreaChart } from 'react-chartkick';
import 'chart.js';
import { Container, Row, Col } from 'reactstrap';
import Big from 'big.js';

class OrderBookComponent extends Component {

  EXCHANGE = 'binance';

  constructor(props) {
    super(props);
    this.state = {
      orderbookBids: new Map(),
      orderbookAsks: new Map(),
      midMarketPrice: new Map()
    }
    this.socket = null;
  }


  componentDidMount() {
    this.socket = socketIOClient('localhost:3005');
    this.socket.on('msg', data => {
      console.log('msg received through socket.io:', data);
    });
    this.socket.on('snapshot', data => {
      const bidThreshold = data.bids[0][0] * 0.9;
      const askThreshold = data.asks[0][0] * 1.1;
      const midMarketPrice = Big(data.bids[0][0]).plus(Big(data.asks[0][0])).div(2);
      const bids = data.bids.filter(bid => bid[0] > bidThreshold).reverse();
      const asks = data.asks.filter(ask => ask[0] < askThreshold);
      this.setState({
        orderbookBids: this.state.orderbookBids.set(data.exchange, bids),
        orderbookAsks: this.state.orderbookAsks.set(data.exchange, asks),
        midMarketPrice: this.state.midMarketPrice.set(data.exchange, midMarketPrice),
      });
    });
  }

  render() {
    const { orderbookBids, orderbookAsks, midMarketPrice } = this.state;
    const charts = [];
    midMarketPrice.forEach((value, key) => (
      charts.push(
        <div key={key}>
          <Row noGutters={true}>
            <Col>
              <AreaChart data={orderbookBids.get(key)} curve={false} colors={["#b00", "#666"]} />
            </Col>
            <Col>
              <AreaChart data={orderbookAsks.get(key)} curve={false} colors={["#3b0", "#666"]} />
            </Col>
          </Row>
          <Row noGutters={true}>
            <Col>
              <p>Data from: {key} exchange</p>
            </Col>
            <Col>
              <p>Mid Market Price: {value.toFixed(2)}</p>
            </Col>
          </Row>
        </div>
      )
    ))

    return (
      <Container fluid={true}>
        { charts }
      </Container>
    )
  }
}

export default translate(OrderBookComponent)