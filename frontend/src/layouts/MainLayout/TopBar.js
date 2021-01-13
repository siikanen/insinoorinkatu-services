import React from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { AppBar, Toolbar, makeStyles } from '@material-ui/core'
import GenericAlert from '../../view/errors/Alerts/index'

const useStyles = makeStyles({
  root: {},
  toolbar: {
    height: 64
  }
})

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles()
  const alert = useSelector(({ alert }) => {
    return alert
  })

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar className={classes.toolbar}>
        <GenericAlert
          alertOpen={alert.type !== 'Hidden'}
          type={alert.type}
          message={alert.message}
        ></GenericAlert>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string
}

export default TopBar
