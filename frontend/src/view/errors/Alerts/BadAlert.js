import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import React from 'react'
import Alert from '@material-ui/lab/Alert'
const BadAlert = (props) => {
  return (
    <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
     Error: {props.message}
    </Alert>
  )
}
export default BadAlert
