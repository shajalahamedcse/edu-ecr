import * as yup from 'yup'

const create = yup.object().shape({
  title: yup.string().required('title field is required'),
  choice: yup.string(),
  parentId: yup.string(),
  description: yup.string(),
  questionType: yup.string().required('question type filed is required'),
  serialNumber: yup.string().required('serial number field is required'),
  questionGroupId: yup.string().required('question group id is required'),
  categories: yup.string(),
  chapterId: yup.string(),
})

export default {
  create,
}
