import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
const EnhancedTableHeader = ({ classes, order, orderBy, onRequestSort }) => {
  const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'payee', numeric: false, disablePadding: false, label: 'Payee' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price (eur) ' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'resolved', numeric: false, disablePadding: false, label: 'Resolved' },
  ]
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
export default EnhancedTableHeader