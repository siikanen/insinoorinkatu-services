import React from 'react'
import { useSelector } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import AllUsers from './AllUsers'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const AllUsersView = () => {
  const classes = useStyles()
  // Workaround to making a row a link.
  // You cant add <a> to a <tr> in order to make the whole row a link
  // Believe me, i've tried

  const users = useSelector(({ users }) => {
    return users.allUsers
  })
  return (
    <Page className={classes.root} title="AllUsers">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item sm={8}>
            <AllUsers users={users}></AllUsers>
          </Grid>
          <Grid item sm={4}></Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default AllUsersView
