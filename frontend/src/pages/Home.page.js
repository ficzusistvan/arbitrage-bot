import React from "react";
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import LeftSidebarLayoutpart from '../layout-parts/LeftSidebar.layoutpart';
import translate from 'redux-polyglot/translate';

const HomePage = (props) => (
  <Jumbotron>
    <Container fluid="true">
      <Row>
        <Col sm={3}>
          <LeftSidebarLayoutpart />
        </Col>
        <Col sm={9}>
          <h1>{props.p.tc('common.hello_world')}</h1>
        </Col>
      </Row>
    </Container>
  </Jumbotron>
);

export default translate(HomePage);