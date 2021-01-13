import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Typography } from '@material-ui/core'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import CancelIcon from '@material-ui/icons/Cancel'


const AllExpenses = ({expenses, setSelectedExpense }) => {
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
                <TableCell>
                  <Typography>{expense.title}</Typography>
                </TableCell>
                {expense.payee ? (
                  <TableCell>{expense.payee.username}</TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
                <TableCell>{expense.price}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
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
      </PerfectScrollbar>
    </React.Fragment>
  )
}

export default AllExpenses
