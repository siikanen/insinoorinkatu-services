import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core'
import Page from '../../../components/Page'
import { addNewExpense } from '../../../reducers/expensesReducer'
import {setAlert} from '../../../reducers/alertReducer'
import { useNavigate } from 'react-router'
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
  const loggedInUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  // let loggedInUser = useSelector(({ users }) => {
  //   return users.loggedInUser
  // })
  const handleSubmit = async (event) => {
    event.preventDefault()

    const title = event.target.title.value
    const price = event.target.price.value
    const description = event.target.description.value
    const tags = event.target.tags.value
    dispatch(
      addNewExpense( {
        title,
        description,
        price,
        payee: {
          id: loggedInUser.id,
          username: loggedInUser.username
        },
        tags: [tags]
      })
    ).catch((error) => {
      dispatch(setAlert('Error','Something went wrong',5000))
    })

    navigate(`/app/expenses/`)
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
              defaultValue="test"
              fullWidth
              label="Title"
              margin="normal"
              name="title"
              variant="outlined"
            />
            <TextField
              defaultValue="test"
              fullWidth
              label="Description"
              margin="normal"
              name="description"
              variant="outlined"
            />
            <TextField
              fullWidth
              defaultValue="1"
              label="Price"
              type="number"
              margin="normal"
              name="price"
              variant="outlined"
            />
            <TextField
              defaultValue="test"
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
