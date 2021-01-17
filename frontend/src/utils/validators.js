import * as Yup from 'yup'

export const expenseValidationSchema = Yup.object().shape({
  title: Yup.string()

    .min(2, 'Minimum length is ${min}!')

    .max(69, 'Too Long!')
    .required('Required'),

  description: Yup.string()
    .min(5, 'Minimum lenght is ${min}!')
    .nullable(true)
    .max(1500, 'Too long description'),
  price: Yup.number().min(0, 'Price must not be negative'),
  tag: Yup.string()
    .min(4, 'Minimum lenght is ${min}')
    .max(10, 'Max lenght is ${max}')
})
export const userValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Must be atleast ${min} chars')
    .max(50, 'Maximum length of ${max} reached')
    .required('Required'),

  password: Yup.string()
    .min(8, 'Must be atleast ${min} chars long!')
    .max(70, 'Upper limit of ${max} reached!')
    .matches(
      '(?=(?:.*?[A-Z]){1})(?=.*?[a-z])(?=(?:.*?[0-9]){2}).*$',
      'Must contain atleast 1 uppercase, lowercase and 2 numbers'
    )
    .required('Required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null],'Passwords must match')
    .required('Required')
})
