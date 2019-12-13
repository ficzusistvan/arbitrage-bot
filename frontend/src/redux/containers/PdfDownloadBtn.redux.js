import { connect } from 'react-redux'
import DownloadBtnComponent from "../../components/pdfs/DownloadBtn.component"

const mapStateToProps = state => {
  return {
    products: state.worksheet.products,
    options: state.worksheet.options,
    users: state.worksheet.users
  };
};

export default connect(
  mapStateToProps,
  null
)(DownloadBtnComponent)