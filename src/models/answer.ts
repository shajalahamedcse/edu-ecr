import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface AnswerAttributes {
  id?: string
  answer: string
  description: string
  questionId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

interface AnswerInstance
  extends Model<AnswerAttributes, AnswerCreationAttributes>,
    AnswerAttributes {}

const Answer = db.sequelize.define<AnswerInstance>(
  'Answers',
  {
    ...SequelizeAttributes.Answers,
  },
  { paranoid: true }
)

Answer.associate = (models) => {
  Answer.belongsTo(models.Question, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })

  Answer.hasMany(models.Image, {
    foreignKey: 'answerId',
    onDelete: 'CASCADE',
  })
}

export default Answer
