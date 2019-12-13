import { connect } from 'react-redux'
import { updateOptionQuantity, setOptionKind } from '../actions/worksheet';
import WorksheetOptionComponent from "../../components/WorksheetOption.component"

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateOptionQuantity: (productCode, optionCode, quantity) => {
      dispatch(updateOptionQuantity(productCode, optionCode, quantity));
    },
    onSetOptionKind: (productCode, optionCode, kind) => {
      dispatch(setOptionKind(productCode, optionCode, kind));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(WorksheetOptionComponent)