import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    PermissionId: yup.string().required('Permission id required'),
    RoleId: yup.string().required('Role Id required'),
  })
  .required()

export default {
  create,
}
