import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ExamTypeAttributes {
  id: string
  subjectId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface ExamTypeCreationAttributes
  extends Optional<ExamTypeAttributes, 'id'> {}

interface ExamTypeInstance
  extends Model<ExamTypeAttributes, ExamTypeCreationAttributes>,
    ExamTypeAttributes {}

const ExamType = db.sequelize.define<ExamTypeInstance>(
  'ExamTypes',
  {
    ...SequelizeAttributes.ExamTypes,
  },
  { paranoid: true }
)

ExamType.associate = (models) => {
  ExamType.belongsTo(models.Subject, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })
  ExamType.hasMany(models.Year, {
    foreignKey: 'examTypeId',
    onDelete: 'CASCADE',
    hooks: true,
  })
  // ExamType.hasMany(models.YearExamType, {
  //   foreignKey: 'examTypeId',
  // })
}

export default ExamType
