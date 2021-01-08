import * as yup from 'yup'

const create = yup.object().shape({
  title: yup.string().required('title field is required'),
  body: yup.string().required(' body field is required'),
  isRead: yup.bool(),
  userId: yup.string(),
})

export default {
  create,
}
