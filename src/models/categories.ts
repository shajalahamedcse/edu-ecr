import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface CategoriesAttributes {
  id: string
  name: string
  subjectId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface CategoriesCreationAttributes
  extends Optional<CategoriesAttributes, 'id'> {}

interface CategoriesInstance
  extends Model<CategoriesAttributes, CategoriesCreationAttributes>,
    CategoriesAttributes {}

const Categories = db.sequelize.define<CategoriesInstance>(
  'Categories',
  {
    ...SequelizeAttributes.Categories,
  },
  { paranoid: true }
)

Categories.associate = (models) => {
  Categories.belongsTo(models.Subject, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE',
  })
  Categories.hasMany(models.Question, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
  })
  Categories.belongsToMany(models.Question, {
    onDelete: 'CASCADE',
    through: models.CategoryQuestion,
  })
}

export default Categories
