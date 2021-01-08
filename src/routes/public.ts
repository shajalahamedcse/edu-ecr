import express from 'express'

const router = express.Router()

export default router

require('controllers/Auth/controller')
require('controllers/Role/controller')
require('controllers/Permission/controller')
require('controllers/User/controller')
require('controllers/RefreshToken/controller')
require('controllers/Grade/controller')
require('controllers/Subject/controller')
require('controllers/ExamType/controller')
require('controllers/Year/controller')
require('controllers/QuestionGroup/controller')
require('controllers/Category/controller')
require('controllers/Question/controller')
require('controllers/Answer/controller')
require('controllers/Image/controller')
require('controllers/Chapter/controller')
require('controllers/StudyMaterial/controller')
require('controllers/Notification/controller')
