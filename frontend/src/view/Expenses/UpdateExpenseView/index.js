import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from '../../../components/Page'
import { useNavigate, useParams } from 'react-router-dom'
import expensesService from '../../../services/expenses'
import DeleteDialog from '../ExpenseView/DeleteExpense'
import { deleteExpense } from '../../../reducers/expensesReducer'
import UpdateExpense from './UpdateExpense'
import {intToPrice} from '../../../utils/utils'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const UpdateExpenseView = () => {
  const classes = useStyles()
  const [expense, setExpense] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    expensesService
      .getExpenseById(id)
      .then((response) => {
        setExpense({
          ...response.data.data,
          price: intToPrice(response.data.data.price),
          tags: response.data.data.tags || []
        })
      })
      .catch((err) => {
        console.error(err)
        // navigate('/app/404')
      })
  }, [id, navigate])
  if (!expense) {
    return <div></div>
  }
  const handleDeleteClick = () => {
    setDialogOpen(true)
  }
  const handleClose = () => {
    setDialogOpen(false)
  }
  const handleConfirmDelete = () => {
    dispatch(deleteExpense(id))
    setDialogOpen(false)
    setExpense(null)
    navigate('/app/expenses')
  }
  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <DeleteDialog
            dialogOpen={dialogOpen}
            handleClose={handleClose}
            handleConfirmDelete={handleConfirmDelete}
          ></DeleteDialog>

          <Grid item sm={4}>
            <UpdateExpense
              expense={expense}
              handleDeleteClick={handleDeleteClick}
            ></UpdateExpense>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default UpdateExpenseView
