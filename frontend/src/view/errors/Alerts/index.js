import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import BadAlert from './BadAlert'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}))

const GenericAlert = (props) => {
  const classes = useStyles()
  if(props.alertOpen){
    switch (props.type) {
      case 'Error':
        return (
          <div className={classes.root}>
          <Collapse in={props.alertOpen}>
            <BadAlert message={props.message}></BadAlert>
          </Collapse>
        </div>
      )
      default:
        return <div></div>
      }
    }
    return <div></div>
}
export default GenericAlert
