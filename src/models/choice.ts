import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ChoiceAttributes {
  id?: string
  letter: string
  choice: string
  questionId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface ChoiceCreationAttributes extends Optional<ChoiceAttributes, 'id'> {}

interface ChoiceInstance
  extends Model<ChoiceAttributes, ChoiceCreationAttributes>,
    ChoiceAttributes {}

const Choice = db.sequelize.define<ChoiceInstance>(
  'Choices',
  {
    ...SequelizeAttributes.Choices,
  },
  { paranoid: true }
)

Choice.associate = (models) => {
  Choice.hasMany(models.Image, {
    foreignKey: 'choiceId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  Choice.belongsTo(models.Question, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })
}

export default Choice
