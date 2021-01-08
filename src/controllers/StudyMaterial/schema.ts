import * as yup from 'yup'

const create = yup.object().shape({
  description: yup.string(),
  videoUrl: yup.string(),
  questionId: yup.string().required(' question id field is required'),
})

export default {
  create,
}
