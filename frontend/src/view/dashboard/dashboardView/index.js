import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import LatestExpenses from './LatestExpenses'
import { getAllExpenses } from '../../../reducers/expensesReducer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Dashboard = () => {
  let user = JSON.parse(window.localStorage.getItem('loggedUser'))
  let token = user.token
  const [alertOpen, setAlertOpen] = useState(false)
  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllExpenses(token)).catch((error)=>{
      setAlertOpen(true)
    }
    )
  }, [dispatch,token])
  const expenses = useSelector(({ expenses }) => {
    return expenses
  })

  const classes = useStyles()

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestExpenses expenses={expenses} alertOpen={alertOpen}></LatestExpenses>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default Dashboard
