import { connect } from 'react-redux'
import { removeProduct } from '../actions/worksheet'
import WorksheetProductsComponent from "../../components/WorksheetProducts.component"

const mapStateToProps = state => ({
  products: state.worksheet.products,
  options: state.worksheet.options
})

const mapDispatchToProps = dispatch => ({
  removeProduct: code => dispatch(removeProduct(code))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorksheetProductsComponent)