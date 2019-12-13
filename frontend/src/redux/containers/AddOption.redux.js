import React from 'react';
import { connect } from "react-redux";
import AutocompleteOptionComponent from "../../components/AutocompleteOption.component";
import { addOption } from "../actions/worksheet";
import { Button, Col, Row } from 'reactstrap';
import translate from 'redux-polyglot/translate';

const AddOptionRedux = ({ productCode, dispatch, p }) => {

  let input;

  const handleChooseBtnClick = () => {
    if (!input.state.value.trim()) {
      return;
    }
    dispatch(addOption(productCode, input.state.value));
    input.clearInput();
  }

  return (
    <Row>
      <Col sm={8}>
        <AutocompleteOptionComponent label={p.tc('worksheet.choose_a_code')} ref={node => input = node} />
      </Col>
      <Col sm={4}>
        <Button block color="primary" onClick={handleChooseBtnClick}>{p.tc('worksheet.choose')}</Button>
      </Col>
    </Row>
  )
}

export default connect()(translate(AddOptionRedux))