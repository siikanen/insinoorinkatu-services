import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAlert } from '../../../reducers/alertReducer'
import {
  Container,
  Grid,
  Box,
  makeStyles,
  Button,
  Tooltip,
  IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Page from '../../../components/Page'
import { NavLink as RouterLink, useNavigate, useParams } from 'react-router-dom'
import expensesService from '../../../services/expenses'
import DeleteDialog from './DeleteExpense'
import { deleteExpense } from '../../../reducers/expensesReducer'
import ExpenseCard from './ExpenseCard'
import { intToPrice, humanizeDate } from '../../../utils/utils'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const SingleExpenseView = () => {
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
          date: humanizeDate(response.data.data.date),
          tags: response.data.data.tags || []
        })
      })
      .catch((err) => {
        dispatch(setAlert('SERVER_ERROR', err))
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
    dispatch(deleteExpense(id)).then(() => {
      setDialogOpen(false)
      setExpense(null)
      dispatch(setAlert('SUCCESS', `Deleted expense: ${expense.title}`)).then(() => {
        navigate('/app/expenses')
      })
    })

  }

  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <Grid item>
          <DeleteDialog
            dialogOpen={dialogOpen}
            handleClose={handleClose}
            handleConfirmDelete={handleConfirmDelete}
          ></DeleteDialog>
          <Grid item justifycontent="flex-end">
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDeleteClick}>
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item sm={4}>
            <ExpenseCard expense={expense}></ExpenseCard>
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Tooltip title="Edit expense">
                <Button
                  color="primary"
                  component={RouterLink}
                  to={`/app/expenses/update/${expense.id}`}
                  endIcon={<ArrowRightIcon />}
                  size="small"
                  variant="text"
                >
                  Edit
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default SingleExpenseView
