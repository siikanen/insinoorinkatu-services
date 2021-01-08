import React from 'react'
import clsx from 'clsx'
import { NavLink as RouterLink ,useNavigate} from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import {
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
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}))

const LatestExpenses = (props) => {

  const classes = useStyles()
  // Copy props array
  const navigate = useNavigate()
  // Workaround to making a row a link.
  // You cant add <a> to a <tr> in order to make the whole row a link
  // Believe me, i've tried
  const handleRowClick = (event, id) => {
    event.preventDefault()
    navigate(`/app/expenses/${id}`)
  }


  return (
    <Card className={clsx(classes.root, props.className)} {...props.rest}>
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
                    <TableSortLabel
                    active direction="desc">
                      Price
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.expenses.map((expense) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          component={RouterLink}
          to={'../expenses/create'}
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Create new
        </Button>
        <Button
          component={RouterLink}
          to={'../expenses'}
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
