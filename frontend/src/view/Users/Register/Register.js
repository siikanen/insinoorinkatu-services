import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik } from 'formik'
import { userValidationSchema } from '../../../utils/validators'
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core'
import Page from '../../../components/Page'
import { addUser } from '../../../reducers/usersReducer'
import { setAlert } from '../../../reducers/alertReducer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}))

const RegisterView = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSubmit = async (
    { passwordConfimation, ...userToAdd },
    setSubmitting
  ) => {
    //setSubmitting(true)
    dispatch(addUser(userToAdd))
      .then(() => {
        setSubmitting(false)
        navigate('/app/dashboard')
      })
      .catch((error) => {
        setSubmitting(false)
        dispatch(setAlert('Error', String(error), 5000))
      })
  }
  return (
    <Page className={classes.root} title="Register">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: '',
              passwordConfirm: ''
            }}
            validationSchema={userValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, setSubmitting)
            }}
          >
            {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Create new account
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username}
                  label="User name"
                  margin="normal"
                  name="username"
                  onChange={handleChange}
                  variant="outlined"
                  defaultValue={values.username}
                />

                <TextField
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  defaultValue={values.password}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm}
                  label="PasswordConfirm"
                  margin="normal"
                  name="passwordConfirm"
                  onChange={handleChange}
                  type="password"
                  defaultValue={values.passwordConfirm}
                  variant="outlined"
                />

                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  )
}

export default RegisterView
