import * as yup from 'yup'

const create = yup.object().shape({
  name: yup.string().required('name field is required'),
  gradeId: yup.string().required('gradeId field is required'),
})

export default {
  create,
}
