import * as yup from 'yup'

const create = yup.object().shape({
  answer: yup.string().required('answer field is required'),
  description: yup.string(),
  questionId: yup.string().required('question id field is required'),
})

export default {
  create,
}
