import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface GradeAttributes {
  id: string
  name: string
  language: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface GradeCreationAttributes extends Optional<GradeAttributes, 'id'> {}

interface GradeInstance
  extends Model<GradeAttributes, GradeCreationAttributes>,
    GradeAttributes {}

const Grade = db.sequelize.define<GradeInstance>(
  'Grades',
  {
    ...SequelizeAttributes.Grades,
  },
  { paranoid: true }
)

Grade.associate = (models) => {
  Grade.hasMany(models.Subject, {
    foreignKey: 'gradeId',
    onDelete: 'CASCADE',
    hooks: true,
  })
}

export default Grade
