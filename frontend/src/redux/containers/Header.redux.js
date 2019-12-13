import { connect } from 'react-redux';
import { logout } from "../../redux/actions/auth";

import HeaderLayoutpart from '../../layout-parts/Header.layoutpart';

const mapStateToProps = state => {
  return { isLoggedIn: state.auth.isLoggedIn };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => {
      dispatch(logout());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLayoutpart);