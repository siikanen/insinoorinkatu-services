import React, { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  TablePagination
} from '@material-ui/core'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import CancelIcon from '@material-ui/icons/Cancel'
import { getExpenses } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 750,
    align: 'left'
  }
}))

const AllExpenses = ({ expenses, setSelectedExpense }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  useEffect(() => {
    dispatch(
      getExpenses({ skip: page * rowsPerPage, limit: rowsPerPage })
    ).catch((error) => {
      dispatch(setAlert('Error', String(error), 5000))
    })
  }, [page, rowsPerPage, dispatch])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  // Workaround to making a row a link.
  // You cant add <a> to a <tr> in order to make the whole row a link
  // Believe me, i've tried
  const handleRowClick = (event, expense) => {
    event.preventDefault()
    setSelectedExpense(expense)
  }

  if (!expenses) {
    return <div></div>
  }
  return (
    <React.Fragment>
      <PerfectScrollbar>
        <Table className={classes.table}>
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
              <TableCell>Date</TableCell>
              <TableCell>Resolved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow
                hover={true}
                key={expense.id}
                onClick={(event) => handleRowClick(event, expense)}
              >
                <TableCell width="30%">
                  <Typography>{expense.title}</Typography>
                </TableCell>
                {expense.payee ? (
                  <TableCell width="20%">{expense.payee.username}</TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
                <TableCell>{`${expense.price}€`}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell width="10%">
                  {expense.resolved ? (
                    <DoneAllIcon></DoneAllIcon>
                  ) : (
                    <CancelIcon></CancelIcon>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={-1}
          //TODO:Replace this
          rowsPerPage={rowsPerPage}
          page={page}
          label={{ page }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelDisplayedRows={({from,to,count})=>{
            return `${from}-${to}`
          }}
          nextIconButtonProps={{ disabled: expenses.length < rowsPerPage }}
        />
      </PerfectScrollbar>
    </React.Fragment>
  )
}

export default AllExpenses
