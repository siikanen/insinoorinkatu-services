import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Page from '../../../components/Page'
import { updateExpense } from '../../../reducers/expensesReducer'
import { setAlert } from '../../../reducers/alertReducer'
import { Formik, FieldArray } from 'formik'
import { priceToInt } from '../../../utils/utils'
import {expenseValidationSchema} from '../../../utils/validators'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(15),
    paddingTop: theme.spacing(0)
  }
}))


const UpdateExpense = ({ expense, handleDeleteClick }) => {
  const navigate = useNavigate()
  const classes = useStyles()
  const { id } = useParams()
  const dispatch = useDispatch()
  const loggedInUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  const [intialExpense] = useState(expense)
  // let loggedInUser = useSelector(({ users }) => {
  //   return users.loggedInUser
  // })

  if (!expense) {
    return <div></div>
  }

  const handleSubmit = async (values, setSubmitting) => {
    setSubmitting(true)
    const objectToSend = {
      payee: {
        id: loggedInUser.id,
        username: loggedInUser.username
      }
    }
    for (let key of Object.keys(values)) {
      // Tag is not meant to be sent to backend
      if (
        values[key] !== intialExpense[key] &&
        values[key] !== '' &&
        key != 'tag'
      ) {
        objectToSend[key] = values[key]
        if (key === 'price') objectToSend[key] = priceToInt(values[key])
      }
    }
    dispatch(updateExpense(objectToSend, id))
      .then(() => {
        setSubmitting(false)
        navigate('/app/expenses')
      })
      .catch((error) => {
        setSubmitting(false)
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
      <Container maxWidth={false}>
        <Box display="flex" flexDirection="row" p={1} m={1}>
          <Box flexGrow={1}>
            <Typography color="textPrimary" variant="h2">
              Update an expense
            </Typography>
            <Typography variant="subtitle1">{expense.id}</Typography>
          </Box>
          <Box>
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDeleteClick}>
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Formik
          initialValues={{
            title: expense.title,
            description: expense.description,
            price: expense.price,
            tags: expense.tags,
            resolved: expense.resolved,
            tag: ''
          }}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting)
          }}
          handleChange={(e) => {
            console.log(e)
          }}
          validationSchema={expenseValidationSchema}
          validateOnChange={true}
        >
          {({
            handleSubmit,
            values,
            handleChange,
            dirty,
            isSubmitting,
            setFieldValue,
            errors
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldArray name="tags">
                {({ insert, remove, push }) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justify="flex-start"
                  >
                    <Grid item xs={10}>
                      <TextField
                        error={!!errors.title}
                        helperText={errors.title}
                        defaultValue={values.title}
                        onChange={handleChange}
                        fullWidth
                        label="Title"
                        margin="normal"
                        name="title"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        labelPlacement="top"
                        label="Resolved"
                        control={
                          <Checkbox
                            checked={values.resolved}
                            onChange={handleChange}
                            color="primary"
                            name="resolved"
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        multiline={true}
                        rows="2"
                        rowsMax="4"
                        error={!!errors.description}
                        helperText={errors.description}
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
                        error={!!errors.price}
                        helperText={errors.price}
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
                        error={!!errors.tag}
                        helperText={errors.tag}
                        onChange={handleChange}
                        label="Tag"
                        value={values.tag}
                        margin="normal"
                        fullWidth
                        name="tag"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Button
                        color="primary"
                        disabled={!!errors.tag}
                        onClick={() => {
                          push(values.tag)
                          setFieldValue('tag', '')
                        }}
                      >
                        Add tag
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {values.tags ? (
                        values.tags.map((tag, index) => (
                          <Chip
                            key={tag}
                            label={tag}
                            color="primary"
                            onDelete={() => {
                              remove(index)
                            }}
                          ></Chip>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Box my={3}>
                        <Button
                          color="primary"
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          disabled={!dirty || isSubmitting}
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

export default UpdateExpense
