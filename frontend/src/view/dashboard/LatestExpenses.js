import React, { useEffect } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getAllExpenses } from '../../reducers/expensesReducer'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
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

const LatestExpenses = ({ className,expenses=[], ...rest }) => {
  // TODO: replace with last X amount of expenses

  console.log('-->',expenses)
  console.log(expenses.map((expense)=>{
    console.log("!")
  }))
  const classes = useStyles()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Latest expenses" />
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
                      Amount
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow hover key={expense.id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.payee.username}</TableCell>
                  <TableCell>
                    {expense.amount}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  )
}

LatestExpenses.propTypes = {
  className: PropTypes.string
}

export default LatestExpenses
