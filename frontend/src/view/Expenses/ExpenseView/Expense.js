import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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
import Page from '../../../components/Page'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { Divider, Card } from '@material-ui/core'
import NotFoundView from '../../errors/NotFoundView'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  }
}))
const Expense = (props) => {
  const classes = useStyles()
  const { id } = useParams()
  const expense = useSelector(({ expenses }) => {
    return expenses.find((expense) => expense.id === id)
  })
  console.log(expense)
  if (!expense) {
    return <NotFoundView></NotFoundView>
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
                    <Typography variant="h4">Amount:</Typography>
                  </TableCell>
                  <TableCell>{expense.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Description:</Typography>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h4">Payee:</Typography>
                  </TableCell>
                  <TableCell>{expense.payee.username}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              color="primary"
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
