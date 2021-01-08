import Role from './role'
import User from './user'
import UserRole from './userrole'
import RefreshToken from './refreshtoken'
import Permission from './permission'
import RolePermission from './rolepermission'
import Grade from './grade'
import Subject from './subject'
import ExamType from './examtype'
import Year from './year'
import QuestionGroup from './questiongroup'
import Categories from './categories'
import Question from './question'
import Answer from './answer'
import Image from './image'
import CategoryQuestion from './categoryquestion'
import Choice from './choice'
import Chapters from './chapter'
import StudyMaterial from './studymaterial'
import Notifications from './notification'

import YearQuestionType from './yearquestiontype'

const models = {
  Role,
  User,
  UserRole,
  RefreshToken,
  Permission,
  RolePermission,
  Grade,
  Subject,
  ExamType,
  Year,
  QuestionGroup,
  YearQuestionType,
  Categories,
  Question,
  Answer,
  Image,
  CategoryQuestion,
  Choice,
  Chapters,
  StudyMaterial,
  Notifications,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models)
  }
  return model
})
