import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import expensesService from '../../../services/expenses'
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
import { updateExpense } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  }
}))

const UpdateExpenseView = () => {
  const [expense, setExpense] = useState()
  const navigate = useNavigate()
  const classes = useStyles()
  const { id } = useParams()
  const dispatch = useDispatch()
  const loggedInUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  // let loggedInUser = useSelector(({ users }) => {
  //   return users.loggedInUser
  // })
  useEffect(() => {
    expensesService
      .getExpenseById( id)
      .then((value) => {
        setExpense(value)
      })
      .catch((err) => navigate('/app/404'))
  }, [id,navigate])
  if (!expense) {
    return <div></div>
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const price = event.target.price.value
    const description = event.target.description.value
    const tags = event.target.tags.value
    dispatch(
      updateExpense( {
        id,
        title,
        description,
        price,
        payee: {
          id: loggedInUser.id,
          username: loggedInUser.username
        },
        tags: [tags]
      })
    ).then(()=>{
      navigate('/app/expenses')
    }).catch((error)=>{
      dispatch(setAlert('Error','Something went wrong',5000))
    })
  }
  return (
    <Page className={classes.root} title="UpdateExpense">

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
                Update an expense
              </Typography>
              <Typography>{expense.id}</Typography>
            </Box>
            <TextField
              defaultValue={expense.title}
              fullWidth
              label="Title"
              margin="normal"
              name="title"
              variant="outlined"
            />
            <TextField
              defaultValue={expense.description}
              fullWidth
              label="Description"
              margin="normal"
              name="description"
              variant="outlined"
            />
            <TextField
              fullWidth
              defaultValue={expense.price}
              label="Price"
              type="number"
              margin="normal"
              name="price"
              variant="outlined"
            />
            <TextField
              defaultValue={expense.tags}
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
                Update Expense
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Page>
  )
}

export default UpdateExpenseView
