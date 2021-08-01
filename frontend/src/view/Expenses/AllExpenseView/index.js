import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import AllExpenses from './AllExpenses'
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
  const [selectedExpense, setSelectedExpense] = useState()
  const expenses = useSelector(({ expenses }) => {
    return expenses
  })
  return (
    <Page className={classes.root} title="AllExpenses">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item sm={8}>
            <AllExpenses
              expenses={expenses}
              setSelectedExpense={setSelectedExpense}
            ></AllExpenses>
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
