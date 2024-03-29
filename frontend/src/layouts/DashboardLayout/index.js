import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import NavBar from './NavBar'
import TopBar from './TopBar'
import { useDispatch } from 'react-redux'
import { logOut } from '../../reducers/usersReducer'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}))

const DashboardLayout = () => {


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const classes = useStyles()
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const handleLogOut = event => {
    dispatch(
      logOut()
    ).then(()=>{
      navigate('/login') 
    })
  }

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)}
        onLogOut={handleLogOut} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
