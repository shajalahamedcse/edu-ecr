import * as yup from 'yup'

const create = yup.object().shape({
  name: yup.string().required('name field is required'),
  language: yup.string().min(2).max(5).required('language field is required'),
})

export default {
  create,
}
