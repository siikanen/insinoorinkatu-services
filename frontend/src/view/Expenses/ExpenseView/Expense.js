import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate, NavLink as RouterLink } from 'react-router-dom'
import expensesService from '../../../services/expenses'
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  CardHeader,
  Typography,
  Button
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import { Divider, Card } from '@material-ui/core'
import DeleteDialog from './DeleteExpense'
import { deleteExpense } from '../../../reducers/expensesReducer'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  }
}))
const Expense = (props) => {
  const [expense, setExpense] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const classes = useStyles()
  const { id } = useParams()
  useEffect(() => {
    expensesService
      .getExpenseById( id)
      .then((value) => {
        setExpense(value)
      })
      .catch((err) => navigate('/app/404'))
  }, [id,navigate])
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
    dispatch(deleteExpense( id))
    setDialogOpen(false)
    setExpense(null)
    navigate('/app/expenses')
  }
  return (
    <Card className={classes.root} >
      <DeleteDialog
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        handleConfirmDelete={handleConfirmDelete}
      ></DeleteDialog>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <CardHeader
            title={expense.title}
            subheader={expense.id}
            action={
              <Tooltip title="Delete">
                <IconButton aria-label="Delete" onClick={handleDeleteClick}>
                  <CloseIcon></CloseIcon>
                </IconButton>
              </Tooltip>
            }
          ></CardHeader>
          <Divider />
          <Box mb={1}>
            <Table>
              <TableHead></TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="h3">Title:</Typography>
                  </TableCell>
                  <TableCell>{expense.title}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Price:</Typography>
                  </TableCell>
                  <TableCell>{expense.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Date:</Typography>
                  </TableCell>
                  <TableCell>{expense.date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Payee:</Typography>
                  </TableCell>
                  <TableCell>{expense.payee.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Description:</Typography>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Tags:</Typography>
                  </TableCell>
                  <TableCell>
                    {expense.tags.map((tag) => (
                      <Typography key={tag}>tag</Typography>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
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
        </Container>
      </Box>
    </Card>
  )
}
export default Expense
