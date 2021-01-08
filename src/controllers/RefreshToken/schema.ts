import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('UserId is required'),
  token: yup.string().required('Token is required'),
})

export default {
  create,
}
