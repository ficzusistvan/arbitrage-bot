import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Button, Col, Row } from 'reactstrap';
import translate from 'redux-polyglot/translate';

const requestData = async (pageSize, page, sorted, filtered) => {
  try {
    const resp = await axios.get("/api/opportunity/list/?pageSize=" + pageSize + "&page=" + page + "&sorted=" + sorted + "&filtered=" + filtered);
    console.log(resp.data);
    return { pages: resp.data.pages, rows: resp.data.rows };
  } catch (err) {
    console.log("err", err);
  }
};

class OpportunitiesComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: null,
      loading: true
    }
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true });
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      });
    });
  }

  handleClick(id) {
    this.props.history.push("/opportunity/" + id);
  }

  async handleDeleteAllBtnClicked() {
    try {
      const resp = await axios.delete("/api/opportunity/all");
      console.log(resp);
      if (resp.status === 200 && resp.statusText === 'OK') {
        this.fetchData({ pageSize: 10, page: 0 });
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  render() {
    const { data, pages, loading } = this.state
    return (
      <>
        <Row>
          <Col sm={{ size: 2 }}>
            <Button block color="primary" onClick={this.handleDeleteAllBtnClicked.bind(this)}>{this.props.p.tc('opportunities.delete_all')}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ReactTable
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    //console.log('A Td Element was clicked!')
                    //console.log('it produced this event:', e)
                    //console.log('It was in this column:', column)
                    //console.log('It was in this row:', rowInfo)
                    //console.log('It was in this table instance:', instance)

                    // IMPORTANT! React-Table uses onClick internally to trigger
                    // events like expanding SubComponents and pivots.
                    // By default a custom 'onClick' handler will override this functionality.
                    // If you want to fire the original onClick handler, call the
                    // 'handleOriginal' function.
                    /*if (handleOriginal) {
                      handleOriginal()
                    }*/
                    this.handleClick(rowInfo.original.id);
                  }
                }
              }}
              manual
              data={data}
              pages={pages}
              columns={[
                {
                  Header: this.props.p.tc('opportunities.direction'),
                  accessor: "direction"
                },
                {
                  Header: this.props.p.tc('opportunities.ask_price'),
                  accessor: "ask_price"
                },
                {
                  Header: this.props.p.tc('opportunities.ask_quantity'),
                  accessor: "ask_quantity"
                },
                {
                  Header: this.props.p.tc('opportunities.bid_price'),
                  accessor: "bid_price"
                },
                {
                  Header: this.props.p.tc('opportunities.bid_quantity'),
                  accessor: "bid_quantity"
                },
                {
                  Header: this.props.p.tc('opportunities.possible_profit'),
                  accessor: "possible_profit"
                },
                {
                  Header: this.props.p.tc('opportunities.profit_currency'),
                  accessor: "profit_currency"
                },
                {
                  Header: this.props.p.tc('opportunities.dt_server'),
                  accessor: "dt_server"
                }
              ]}
              onFetchData={this.fetchData}
              defaultPageSize={10}
              className="-striped -highlight"
              loading={loading} // Display the loading overlay when we need it
              filterable
            />
          </Col>
        </Row>
      </>
    )
  }
}

export default translate(withRouter(OpportunitiesComponent))