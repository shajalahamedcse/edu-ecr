import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ImageAttributes {
  id?: string
  url: string
  description: string
  answerId?: string
  choiceId?: string
  studyMaterialId?: string
  questionId?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

interface ImageInstance
  extends Model<ImageAttributes, ImageCreationAttributes>,
    ImageAttributes {}

const Image = db.sequelize.define<ImageInstance>(
  'Images',
  {
    ...SequelizeAttributes.Images,
  },
  { paranoid: true }
)

Image.associate = (models) => {
  Image.belongsTo(models.Answer, {
    foreignKey: 'answerId',
    onDelete: 'CASCADE',
  })
  Image.belongsTo(models.Question, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })
  Image.belongsTo(models.Choice, {
    foreignKey: 'choiceId',
    onDelete: 'CASCADE',
  })
  Image.belongsTo(models.StudyMaterial, {
    foreignKey: 'studyMaterialId',
    onDelete: 'CASCADE',
  })
}

export default Image
