import React from 'react'
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
import { addNewExpense } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'
import { useNavigate } from 'react-router'
import { FieldArray, Formik } from 'formik'
import { priceToInt } from '../../../utils/utils'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1)
    }
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
  const handleSubmit = async ({ title, description, price, tags }) => {
    dispatch(
      addNewExpense({
        title,
        description: description || null,
        price: priceToInt(price),
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
            'SERVER_ERROR', error
          )
        )
      })
  }

  return (
    <Page className={classes.root} title="CreateExpense">
      <Container maxWidth="sm">
        <Box mb={1}>
          <Typography color="textPrimary" variant="h2">
            Create an expense
          </Typography>
        </Box>
        <Formik
          initialValues={{
            title: '',
            description: '',
            price: 0,
            tags: []
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
                        placeholder="K-market shoppings"
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
                        placeholder={'Chicken and bread'}
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
                        label="Price"
                        name="price"
                        onChange={handleChange}
                      ></TextField>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                      <TextField
                        placeholder="Food"
                        onChange={handleChange}
                        label="Tag"
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
                          Create expense
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

export default CreateExpenseView
