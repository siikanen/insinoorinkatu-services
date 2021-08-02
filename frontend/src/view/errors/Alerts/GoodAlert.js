import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import React from 'react'
import Alert from '@material-ui/lab/Alert'
const GoodAlert = (props) => {
  return (
    <Alert icon={<DoneOutlineIcon fontSize="inherit" />} severity="success">
     Success: {props.message}
    </Alert>
  )
}
export default GoodAlert

