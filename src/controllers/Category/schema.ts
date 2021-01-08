import * as yup from 'yup'

const create = yup.object().shape({
  name: yup.string().required('name field is required'),
  subjectId: yup.string().required(' subject id field is required'),
})

export default {
  create,
}
