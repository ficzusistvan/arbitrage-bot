import { combineReducers } from 'redux';
import auth from './authReducer';
import worksheet from './worksheetReducer';
import { polyglotReducer } from 'redux-polyglot';

export default combineReducers({
  auth,
  worksheet,
  polyglot: polyglotReducer
});