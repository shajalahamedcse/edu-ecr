import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface StudyMaterialAttributes {
  id: string
  description: string
  questionId: string
  videoUrl: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface StudyMaterialCreationAttributes
  extends Optional<StudyMaterialAttributes, 'id'> {}

interface StudyMaterialInstance
  extends Model<StudyMaterialAttributes, StudyMaterialCreationAttributes>,
    StudyMaterialAttributes {}

const StudyMaterial = db.sequelize.define<StudyMaterialInstance>(
  'StudyMaterials',
  {
    ...SequelizeAttributes.StudyMaterials,
  },
  { paranoid: true }
)

StudyMaterial.associate = (models) => {
  StudyMaterial.belongsTo(models.Question, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })
  StudyMaterial.hasMany(models.Image, {
    foreignKey: 'studyMaterialId',
    onDelete: 'CASCADE',
  })
}

export default StudyMaterial
