import * as yup from 'yup'

const create = yup.object().shape({
  fullName: yup.string().required('Name is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  active: yup.boolean().nullable(),
  referralCode: yup.string(),
  referredByCode: yup.string(),
  language: yup.string(),
  grade: yup.string(),
  method: yup.string(),
  tokenVerify: yup.string().nullable(),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('confirmNewPassword')], 'Passwords dont match'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('newPassword')], 'Passwords dont match'),
})

const update = yup.object().shape({
  fullName: yup.string().required('Nama is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  active: yup.boolean().nullable(),
  language: yup.string().nullable(),
  grade: yup.string().nullable(),
  method: yup.string().nullable(),
  tokenVerify: yup.string().nullable(),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('confirmNewPassword')], 'Password is required'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('newPassword')], 'Password is required'),
})

const createPassword = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('confirmNewPassword')], 'Password is required'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Password must be at least 8 chars')
    .oneOf([yup.ref('newPassword')], 'Password is required'),
})

const login = yup
  .object()
  .shape({
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 chars')
      .required('Password is required'),
  })
  .required()

export default {
  create,
  createPassword,
  update,
  login,
}
