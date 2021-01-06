import React from 'react'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core'
import Page from '../../../components/Page'
import { AddNewExpense } from '../../../reducers/expensesReducer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  }
}))

const CreateExpenseView = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let loggedInUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  // let loggedInUser = useSelector(({ users }) => {
  //   return users.loggedInUser
  // })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const amount = event.target.amount.value
    const description = event.target.description.value
    const tags = event.target.tags.value
     dispatch(
     AddNewExpense(loggedInUser.token,{
        title,
        description,
        amount,
        date:{},
        payee: {
          id: loggedInUser.id,
          username: loggedInUser.username
        },
        tags:[tags]
      })
    )
  }
  return (
    <Page className={classes.root} title="CreateExpense">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <Box mb={1}>
              <Typography color="textPrimary" variant="h2">
                Create an expense
              </Typography>
            </Box>
            <TextField
              defaultValue='test'
              fullWidth
              label="Title"
              margin="normal"
              name="title"
              variant="outlined"
            />
            <TextField
              defaultValue='test'
              fullWidth
              label="Description"
              margin="normal"
              name="description"
              variant="outlined"
            />
            <TextField
              fullWidth
              defaultValue='1'
              label="Amount"
              type="number"
              margin="normal"
              name="amount"
              variant="outlined"
            />
            <TextField
              defaultValue='test'
              fullWidth
              label="Tags"
              margin="normal"
              name="tags"
              variant="outlined"
            />

            <Box my={3}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Create expense
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Page>
  )
}

export default CreateExpenseView