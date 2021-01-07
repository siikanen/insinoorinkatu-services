import React, { useState, useEffect } from 'react'
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
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { Divider, Card } from '@material-ui/core'

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
  let navigate = useNavigate()
  const classes = useStyles()
  const { id } = useParams()
  const loggedInUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  useEffect(() => {
    expensesService
      .getExpenseById(loggedInUser.token, id)
      .then((value) => {
        setExpense(value.data[0])
      })
      .catch((err) => navigate('/app/404'))
  }, [])
  if (!expense) {
    return <div></div>
  }
  return (
    <Card className={classes.root} title="CreateExpense">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <CardHeader title={expense.title} subheader={expense.id}></CardHeader>
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
                  <TableCell>{expense.amount}</TableCell>
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
                      <Typography key = {tag}>tag</Typography>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end" p={2}>
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
          </Box>
        </Container>
      </Box>
    </Card>
  )
}
export default Expense
