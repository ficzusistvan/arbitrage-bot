import { connect } from 'react-redux'
import { updateProductQuantity, setProductKind } from '../actions/worksheet';
import WorksheetProductComponent from "../../components/WorksheetProduct.component"

const mapDispatchToProps = dispatch => {
  return {
    onUpdateProductQuantity: (code, quantity) => {
      dispatch(updateProductQuantity(code, quantity));
    },
    onSetProductKind: (code, kind) => {
      dispatch(setProductKind(code, kind));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(WorksheetProductComponent)