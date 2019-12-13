import React, { Component } from 'react'
import axios from 'axios';
import { Col, Row } from 'reactstrap';
import translate from 'redux-polyglot/translate';

class CurrencyPairComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pair1: "pair1",
      pair2: "pair2",
    }
  }

  async componentDidMount() {
    try {
      var resp = await axios.get("/api/exchange/currency-pair");
      console.log(resp.data);
      this.setState({ pair1: resp.data.currencyPair1, pair2: resp.data.currencyPair2 })
    } catch (err) {
      console.log("err", err);
    }
  }

  render() {
    const { pair1, pair2 } = this.state
    return (
      <Row>
        <Col sm={{ size: 6 }}>
        <h4>{'CurrencyPair1: '}{pair1}{' vs. CurrencyPair2: '}{pair2}</h4>
        </Col>
      </Row>
    )
  }
}

export default translate(CurrencyPairComponent)