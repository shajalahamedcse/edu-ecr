import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface YearQuestionTypeAttributes {
  id?: string
  questionTypeId: string
  yearId: string
  createdAt?: Date
  updatedAt?: Date
}

interface YearQuestionTypeCreationAttributes
  extends Optional<YearQuestionTypeAttributes, 'id'> {}

interface YearQuestionTypeInstance
  extends Model<YearQuestionTypeAttributes, YearQuestionTypeCreationAttributes>,
    YearQuestionTypeAttributes {}

const YearQuestionType = db.sequelize.define<YearQuestionTypeInstance>(
  'YearQuestionTypes',
  {
    ...SequelizeAttributes.YearQuestionTypes,
  }
)

// YearQuestionType.associate = (models) => {
//   YearQuestionType.belongsTo(models.YearExamType, {
//     foreignKey: 'YearQuestionTypeId',
//   })
// }

export default YearQuestionType
