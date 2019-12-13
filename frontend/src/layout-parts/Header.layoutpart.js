import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import translate from 'redux-polyglot/translate';

class HeaderLayoutPart extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={RRNavLink} to="/">ESSolutions</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {/* Orderbooks */}
              <NavItem>
                <NavLink tag={RRNavLink} to='/orderbooks'>{this.props.p.tc('orderbooks.orderbooks')}</NavLink>
              </NavItem>
              {/* Opportunities */}
              <NavItem>
                <NavLink tag={RRNavLink} to='/opportunities'>{this.props.p.tc('opportunities.opportunities')}</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

HeaderLayoutPart.propTypes = {
}

export default translate(HeaderLayoutPart);