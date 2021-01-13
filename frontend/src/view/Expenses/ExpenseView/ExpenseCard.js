import React from 'react'
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
  Chip,
  Tooltip,
  Button
} from '@material-ui/core'

import { NavLink as RouterLink } from 'react-router-dom'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { Divider, Card } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark
  }
}))
const ExpenseCard = ({ expense }) => {
  const classes = useStyles()
  if (!expense) {
    return <div></div>
  }
  return (
    <Card className={classes.root}>
      <Box display="flex" flexDirection="column" justifyContent="center">
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
                  {expense.payee ? (
                    <TableCell>{expense.payee.username}</TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
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
                      <Chip key={tag} label={tag} color="primary"></Chip>
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
export default ExpenseCard
