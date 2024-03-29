import React from 'react'
import {  useSelector } from 'react-redux'
import clsx from 'clsx'

import PropTypes from 'prop-types'
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp'
import GenericAlert from '../../view/errors/Alerts/index'
const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  }
}))

const TopBar = ({ className, onMobileNavOpen, onLogOut, ...rest }) => {
  const classes = useStyles()
  const alert = useSelector(({ alert }) => {
    return alert
  })



  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        {/*RouterLink to="/">
          LOGO
        </RouterLink>
  */}
        <GenericAlert
          alertOpen={alert.alertDisplayType !== 'Hidden'}
          alertDisplayType={alert.alertDisplayType}
          message={alert.message}
        ></GenericAlert>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton onClick={onLogOut} color="inherit">
            <ExitToAppSharpIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
}

export default TopBar
