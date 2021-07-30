import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import LatestExpenses from './LatestExpenses'
import { getExpenses } from '../../../reducers/expensesReducer'
import {setAlert} from '../../../reducers/alertReducer'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const Dashboard = () => {

  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(getExpenses({limit:10})).catch((error)=>{
      dispatch(setAlert('SERVER_ERROR',error))
    }
    )
  }, [dispatch])
  const expenses = useSelector(({ expenses }) => {
    return expenses
  })
  const classes = useStyles()

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestExpenses expenses={expenses} ></LatestExpenses>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default Dashboard
