import * as yup from 'yup'

const create = yup.object().shape({
  url: yup.string(),
  description: yup.string(),
  answerId: yup.string(),
  choiceId: yup.string(),
  questionId: yup.string(),
  studyMaterialId: yup.string(),
})

export default {
  create,
}
