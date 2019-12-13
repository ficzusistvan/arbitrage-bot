import { connect } from 'react-redux'
import { removeOption } from '../actions/worksheet'
import WorksheetOptionsComponent from "../../components/WorksheetOptions.component"

const mapStateToProps = (state, ownProps) => ({
  options: state.worksheet.options.filter(option => option.productCode === ownProps.productCode)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeOption: code => dispatch(removeOption(ownProps.productCode, code))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorksheetOptionsComponent)