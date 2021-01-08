import { Model, Optional } from 'sequelize'

import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface QuestionAttributes {
  id: string
  title: string
  choice?: object
  parentId?: string
  description?: string
  questionType: string
  serialNumber: string
  questionGroupId: string
  categoryId?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface QuestionCreationAttributes
  extends Optional<QuestionAttributes, 'id'> {}

interface QuestionInstance
  extends Model<QuestionAttributes, QuestionCreationAttributes>,
    QuestionAttributes {}

const Question = db.sequelize.define<QuestionInstance>(
  'Questions',
  {
    ...SequelizeAttributes.Questions,
  },
  { paranoid: true }
)

Question.associate = (models) => {
  // Question.belongsTo(models.Question, {
  //   foreignKey: 'parentId',
  //   onDelete: 'CASCADE',
  // })

  Question.hasMany(models.Question, {
    as: 'SubQuestions',
    foreignKey: 'parentId',
  })

  Question.hasMany(models.Answer, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })

  Question.hasMany(models.Image, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })

  Question.hasMany(models.Choice, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })

  Question.hasMany(models.StudyMaterial, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })

  Question.belongsToMany(models.Categories, {
    onDelete: 'CASCADE',
    through: models.CategoryQuestion,
  })

  Question.belongsTo(models.QuestionGroup, {
    foreignKey: 'questionGroupId',
    onDelete: 'CASCADE',
  })
  Question.belongsTo(models.Chapters, {
    foreignKey: 'chapterId',
    onDelete: 'CASCADE',
  })
}

export default Question
