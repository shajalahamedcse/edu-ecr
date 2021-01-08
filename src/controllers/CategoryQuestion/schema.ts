import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    questionId: yup.string().required('question id required'),
    categoryId: yup.string().required('category Id required'),
  })
  .required()

export default {
  create,
}
