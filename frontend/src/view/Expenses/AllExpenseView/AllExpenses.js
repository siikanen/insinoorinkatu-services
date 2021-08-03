import React, { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import EnhancedTableHeader from './EnhancedTableHeader'
import { Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  TablePagination,
  Box,
  Button,
  Card,
  CardHeader,
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
import DoneAllIcon from '@material-ui/icons/DoneAll'
import CancelIcon from '@material-ui/icons/Cancel'
import { getExpenses } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'

//TODO: maybe move these to a comming utils file?
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }, table: {
    minWidth: 750,
    align: 'left'
  }
}))

const AllExpenses = ({ expenses, setSelectedExpense }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('price')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  useEffect(() => {
    dispatch(
      getExpenses({ skip: page * rowsPerPage, limit: rowsPerPage })
    ).catch((error) => {
      if (error?.response?.status === 404) {
        dispatch(setAlert('INTERNAL_ERROR', 'You have reached the end of the list!'))
        setPage(page - 1)
      }
      else {
        dispatch(setAlert('SERVER_ERROR', error))
      }
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
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  if (!expenses) {
    return <div></div>
  }
  return (
    <React.Fragment>
      <Card className={clsx(classes.root)}>
        <PerfectScrollbar>
          <Table className={classes.table}>
            <EnhancedTableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {stableSort(expenses, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((expense, index) => {
                  return (
                    <TableRow
                      hover={true}
                      key={expense.id}
                      onClick={(event) => handleRowClick(event, expense)}
                    >
                      <TableCell width="30%">
                        <Typography>{expense.title}</Typography>
                      </TableCell>
                      {expense.payee ? (
                        <TableCell>{expense.payee.username}</TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                      <TableCell>{`${expense.price}€`}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        {expense.resolved ? (
                          <DoneAllIcon></DoneAllIcon>
                        ) : (
                          <CancelIcon></CancelIcon>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            //??? -1 why?
            count={-1}
            rowsPerPage={rowsPerPage}
            page={page}
            label={{ page }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}-${to}`
            }}
            nextIconButtonProps={{
              disabled:
                expenses.length < rowsPerPage
            }}
          />
        </PerfectScrollbar>
      </Card>
    </React.Fragment>
  )
}

export default AllExpenses
