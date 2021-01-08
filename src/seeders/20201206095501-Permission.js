import { v4 as uuidv4 } from 'uuid'

const {
  permissionPermissions,
} = require('../controllers/Permission/permissions')

const { rolePermissions } = require('../controllers/Role/permissions')

const { userPermissions } = require('../controllers/User/permissions')
const { gradePermissions } = require('../controllers/Grade/permissions')
const { subjectPermissions } = require('../controllers/Subject/permissions')
const { examTypePermissions } = require('../controllers/ExamType/permissions')
const { yearPermissions } = require('../controllers/Year/permissions')
const {
  questionGroupPermissions,
} = require('../controllers/QuestionGroup/permissions')
const { categoryPermissions } = require('../controllers/Category/permissions')
const { questionPermissions } = require('../controllers/Question/permissions')
const { answerPermissions } = require('../controllers/Answer/permissions')

const permissions = [
  ...userPermissions,
  ...rolePermissions,
  ...permissionPermissions,
  ...gradePermissions,
  ...subjectPermissions,
  ...examTypePermissions,
  ...yearPermissions,
  ...questionGroupPermissions,
  ...categoryPermissions,
  ...questionPermissions,
  ...answerPermissions,
]

function getPermissions() {
  const listOfPermissions = permissions.map((permission) => ({
    id: uuidv4(),
    name: permission,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return listOfPermissions
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permissions', [...getPermissions()])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Permissions')
  },
}
