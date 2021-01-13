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
  makeStyles,
  Grid,
  Chip
} from '@material-ui/core'
import Page from '../../../components/Page'
import { updateExpense } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'
import { Formik, FieldArray } from 'formik'
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
      .getExpenseById(id)
      .then((value) => {
        setExpense(value)
      })
      .catch((err) => navigate('/app/404'))
  }, [id, navigate])
  if (!expense) {
    return <div></div>
  }

  const handleSubmit = async ({ title, description, price, tags }) => {
    dispatch(
      updateExpense({
        id,
        title,
        description,
        price,
        payee: {
          id: loggedInUser.id,
          username: loggedInUser.username
        },
        tags
      })
    )
      .then(() => {
        navigate('/app/expenses')
      })
      .catch((error) => {
        dispatch(
          setAlert(
            'Error',
            `${error.response.status}: ${error.response.data.error.message}`,
            5000
          )
        )
      })
  }
  return (
    <Page className={classes.root} title="UpdateExpense">
      <Container maxWidth="sm">
        <Box mb={1}>
          <Typography color="textPrimary" variant="h2">
            Update an expense
          </Typography>
          <Typography variant="subtitle1">{expense.id}</Typography>
        </Box>
        <Formik
          initialValues={{
            title: expense.title,
            description: expense.description,
            price: expense.price,
            tags: expense.tags,
            tag: ''
          }}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
        >
          {({ handleSubmit, values, handleChange, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <FieldArray name="tags">
                {({ insert, remove, push }) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={12}>
                      <TextField
                        defaultValue={values.title}
                        onChange={handleChange}
                        fullWidth
                        label="Title"
                        margin="normal"
                        name="title"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        multiline={true}
                        rows="2"
                        rowsMax="4"
                        defaultValue={values.description}
                        onChange={handleChange}
                        fullWidth
                        label="Description"
                        margin="normal"
                        name="description"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        inputProps={{ step: 0.01 }}
                        type="number"
                        defaultValue={expense.price}
                        label="Price"
                        name="price"
                        onChange={handleChange}
                      ></TextField>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                      <TextField
                        placeholder="Tag"
                        onChange={handleChange}
                        label="Tag"
                        value={values.tag}
                        margin="normal"
                        fullWidth
                        name="tag"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Button
                        color="primary"
                        onClick={() => {
                          push(values.tag)
                          setFieldValue('tag', '')
                        }}
                      >
                        Add tag
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {values.tags.map((tag, index) => (
                        <Chip
                          key={tag}
                          label={tag}
                          color="primary"
                          onDelete={() => {
                            remove(index)
                          }}
                        ></Chip>
                      ))}
                    </Grid>

                    <Grid item xs={12}>
                      <Box my={3}>
                        <Button
                          color="primary"
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Update expense
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </form>
          )}
        </Formik>
      </Container>
    </Page>
  )
}

export default UpdateExpenseView
