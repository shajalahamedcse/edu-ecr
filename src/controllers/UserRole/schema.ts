import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('User id is required'),
    RoleId: yup.string().required('Role id is required'),
  })
  .required()

export default {
  create,
}
