import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ChaptersAttributes {
  id: string
  name: string
  subjectId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface ChaptersCreationAttributes
  extends Optional<ChaptersAttributes, 'id'> {}

interface ChaptersInstance
  extends Model<ChaptersAttributes, ChaptersCreationAttributes>,
    ChaptersAttributes {}

const Chapters = db.sequelize.define<ChaptersInstance>(
  'Chapters',
  {
    ...SequelizeAttributes.Chapters,
  },
  { paranoid: true }
)

Chapters.associate = (models) => {
  Chapters.belongsTo(models.Subject, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })
  Chapters.hasMany(models.Question, {
    foreignKey: 'chapterId',
    onDelete: 'CASCADE',
  })
}

export default Chapters
