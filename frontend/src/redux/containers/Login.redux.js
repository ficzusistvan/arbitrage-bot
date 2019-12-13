import { connect } from 'react-redux';
import { login } from '../actions/auth';
import LoginPage from '../../pages/Login.page';

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (user) => {
      dispatch(login(user));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);