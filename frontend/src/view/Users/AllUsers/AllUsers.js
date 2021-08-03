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
  TablePagination,
  Card
} from '@material-ui/core'

import clsx from 'clsx'
import { getUsers } from '../../../reducers/usersReducer'
import { setAlert } from '../../../reducers/alertReducer'
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 750,
    align: 'left'
  },
  root: {
    width: '100%'
  }
}))

const AllUsers = ({ users }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  useEffect(() => {
    dispatch(
      getUsers()
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
  const handleRowClick = (event, user) => {
    event.preventDefault()
  }

  if (!users) {
    return <div></div>
  }
  return (
    <React.Fragment>
      <Card className={clsx(classes.root)} width="500">
        <PerfectScrollbar>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  hover={true}
                  key={user.id}
                  onClick={(event) => handleRowClick(event, user)}
                >
                  <TableCell width="30%">
                    <Typography>{user.username}</Typography>
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
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}-${to}`
            }}
            nextIconButtonProps={{ disabled: users.length < rowsPerPage }}
          />
        </PerfectScrollbar>
      </Card>
    </React.Fragment>
  )
}

export default AllUsers
