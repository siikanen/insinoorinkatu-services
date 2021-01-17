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
