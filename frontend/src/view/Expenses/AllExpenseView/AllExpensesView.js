import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink as RouterLink, useNavigate } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Typography } from '@material-ui/core'
import { getAllExpenses } from '../../../reducers/expensesReducer'
import Page from '../../../components/Page'
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}))

const AllExpensesView = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  // Workaround to making a row a link.
  // You cant add <a> to a <tr> in order to make the whole row a link
  // Believe me, i've tried
  const handleRowClick = (event, id) => {
    event.preventDefault()
    navigate(`/app/expenses/${id}`)
  }

  const user = JSON.parse(window.localStorage.getItem('loggedUser'))
  const token = user.token
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllExpenses(token))
  }, [dispatch, token])
  const expenses = useSelector(({ expenses }) => {
    return expenses
  })
  if (!expenses) {
    return <div></div>
  }
  return (
    <Page className={classes.root} title="UpdateExpense">
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Payee</TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Price
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Resolved
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow
                  hover
                  key={expense.id}
                  onClick={(event) => handleRowClick(event, expense.id)}
                >
                  <TableCell>
                    <Typography>{expense.title}</Typography>
                  </TableCell>
                  <TableCell>{expense.payee.username}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>Resolved?</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          component={RouterLink}
          to={'/app/expenses/create'}
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Create new
        </Button>
      </Box>
    </Page>
  )
}

export default AllExpensesView
