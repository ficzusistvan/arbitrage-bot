import { connect } from 'react-redux'
import WorksheetUserComponent from "../../components/WorksheetUser.component"

const mapStateToProps = state => ({
  authUserId: state.auth.user ? state.auth.user.id : null
})

export default connect(
  mapStateToProps,
  null
)(WorksheetUserComponent)