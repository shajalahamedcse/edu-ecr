import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface CategoryQuestionAttributes {
  id?: string
  categoryId: string
  questionId: string
  createdAt?: Date
  updatedAt?: Date
}

interface CategoryQuestionCreationAttributes
  extends Optional<CategoryQuestionAttributes, 'id'> {}

interface CategoryQuestionInstance
  extends Model<CategoryQuestionAttributes, CategoryQuestionCreationAttributes>,
    CategoryQuestionAttributes {}

const CategoryQuestion = db.sequelize.define<CategoryQuestionInstance>(
  'CategoryQuestions',
  {
    ...SequelizeAttributes.CategoryQuestions,
  }
)

export default CategoryQuestion
