import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface SubjectAttributes {
  id: string
  name: string
  gradeId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

interface SubjectInstance
  extends Model<SubjectAttributes, SubjectCreationAttributes>,
    SubjectAttributes {}

const Subject = db.sequelize.define<SubjectInstance>(
  'Subjects',
  {
    ...SequelizeAttributes.Subjects,
  },
  { paranoid: true }
)

Subject.associate = (models) => {
  Subject.belongsTo(models.Grade, {
    foreignKey: 'gradeId',
    onDelete: 'CASCADE',
  })
  Subject.hasMany(models.ExamType, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })

  Subject.hasMany(models.Categories, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })
  Subject.hasMany(models.Chapters, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })
}

export default Subject
