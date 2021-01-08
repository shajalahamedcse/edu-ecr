import * as yup from 'yup'

const create = yup.object().shape({
  nama: yup.string().required('Name is required'),
})

export default {
  create,
}
