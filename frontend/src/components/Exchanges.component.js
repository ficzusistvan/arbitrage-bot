import React, { Component } from 'react'
import axios from 'axios';
import { Col, Row } from 'reactstrap';
import translate from 'redux-polyglot/translate';

class ExchangesComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exchange1: "ex1",
      exchange2: "ex2"
    }
  }

  async componentDidMount() {
    try {
      var resp = await axios.get("/api/exchange/list");
      console.log(resp.data);
      this.setState({ exchange1: resp.data.exchange1, exchange2: resp.data.exchange2 })
    } catch (err) {
      console.log("err", err);
    }
  }

  render() {
    const { exchange1, exchange2 } = this.state
    return (
      <Row>
        <Col sm={{ size: 6 }}>
          <h3>{'Exchange1: '}{exchange1}{' vs. Exchange2: '}{exchange2}</h3>
        </Col>
      </Row>
    )
  }
}

export default translate(ExchangesComponent)