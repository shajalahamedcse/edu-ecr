import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface QuestionGroupAttributes {
  id: string
  name: string
  yearId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface QuestionGroupCreationAttributes
  extends Optional<QuestionGroupAttributes, 'id'> {}

interface QuestionGroupInstance
  extends Model<QuestionGroupAttributes, QuestionGroupCreationAttributes>,
    QuestionGroupAttributes {}

const QuestionGroup = db.sequelize.define<QuestionGroupInstance>(
  'QuestionGroups',
  {
    ...SequelizeAttributes.QuestionGroups,
  },
  { paranoid: true }
)

QuestionGroup.associate = (models) => {
  QuestionGroup.belongsTo(models.Year, {
    foreignKey: 'yearId',
    onDelete: 'CASCADE',
  })
  // QuestionGroup.hasMany(models.Categories, {
  //   foreignKey: 'questionGroupId',
  //   onDelete: 'CASCADE',
  // })
  QuestionGroup.hasMany(models.Question, {
    foreignKey: 'questionGroupId',
    onDelete: 'CASCADE',
  })
}

export default QuestionGroup
