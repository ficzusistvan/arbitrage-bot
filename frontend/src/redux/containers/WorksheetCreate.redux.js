import { connect } from 'react-redux'
import { initWorksheet, clearWorksheet } from '../actions/worksheet';
import WorksheetCreateComponent from "../../components/WorksheetCreate.component"

const mapStateToProps = state => ({
  products: state.worksheet.products,
  options: state.worksheet.options,
  users: state.worksheet.users
})

const mapDispatchToProps = dispatch => {
  return {
    onInitWorksheet: (products, options, users) => {
      dispatch(initWorksheet(products, options, users));
    },
    onClearWorksheet: () => {
      dispatch(clearWorksheet());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorksheetCreateComponent)