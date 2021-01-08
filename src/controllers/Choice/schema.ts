import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    choice: yup.string().required('choice is required'),
    letter: yup.string().required('letter is required'),
    questionId: yup.string().required('question Id is required'),
  })
  .required()

export default {
  create,
}
