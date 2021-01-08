import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface YearAttributes {
  id?: string
  name: string
  examTypeId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface YearCreationAttributes extends Optional<YearAttributes, 'id'> {}

interface YearInstance
  extends Model<YearAttributes, YearCreationAttributes>,
    YearAttributes {}

const Year = db.sequelize.define<YearInstance>(
  'Years',
  {
    ...SequelizeAttributes.Years,
  },
  {
    paranoid: true,
  }
)

Year.associate = (models) => {
  Year.hasMany(models.QuestionGroup, {
    foreignKey: 'yearId',
    onDelete: 'CASCADE',
  })
  Year.belongsTo(models.ExamType, {
    foreignKey: 'examTypeId',
  })
}

export default Year
