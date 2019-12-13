import { connect } from 'react-redux';
import { register } from '../actions/auth';
import RegisterPage from '../../pages/Register.page';

const mapDispatchToProps = dispatch => {
  return {
    onRegister: (user) => {
      dispatch(register(user));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(RegisterPage);