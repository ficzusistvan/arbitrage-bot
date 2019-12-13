import { connect } from 'react-redux'
import WorksheetUsersComponent from "../../components/WorksheetUsers.component"

const mapStateToProps = state => {
  return ({
    users: state.worksheet.users
  })
}

export default connect(
  mapStateToProps
)(WorksheetUsersComponent)