import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import AllExpenses from './AllExpenses'
import { setAlert } from '../../../reducers/alertReducer'
import { getAllExpenses } from '../../../reducers/expensesReducer'
import ExpenseCard from '../ExpenseView/ExpenseCard'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const AllExpensesView = () => {
  const classes = useStyles()
  // Workaround to making a row a link.
  // You cant add <a> to a <tr> in order to make the whole row a link
  // Believe me, i've tried

  const dispatch = useDispatch()
  const [selectedExpense, setSelectedExpense] = useState()
  useEffect(() => {
    dispatch(getAllExpenses()).catch((error) => {
      if (error.response.status) {
        dispatch(
          setAlert(
            'Error',
            `${error.response.status}: ${error.response.data.error.message}`,
            5000
          )
        )
      }
    })
  }, [dispatch])
  const expenses = useSelector(({ expenses }) => {
    return expenses
  })
  return (
    <Page className={classes.root} title="AllExpenses">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item sm={8}>
            <AllExpenses expenses={expenses} setSelectedExpense={setSelectedExpense}></AllExpenses>
          </Grid>
          <Grid item sm={4}>
            <ExpenseCard expense={selectedExpense}></ExpenseCard>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default AllExpensesView
