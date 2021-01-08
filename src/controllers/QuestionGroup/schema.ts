import * as yup from 'yup'

const create = yup.object().shape({
  name: yup.string().required('name field is required'),
  yearId: yup.string().required(' year id field is required'),
})

export default {
  create,
}
