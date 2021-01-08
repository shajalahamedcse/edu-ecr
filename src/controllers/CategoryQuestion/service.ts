import models from 'models'

import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { CategoryQuestionAttributes } from 'models/categoryquestion'
import schema from 'controllers/CategoryQuestion/schema'

const { CategoryQuestion } = models

class CategoryQuestionService {
  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(
    formData: CategoryQuestionAttributes,
    txn?: Transaction
  ) {
    const values = useValidation(schema.create, formData)
    const data = await CategoryQuestion.create(values, {
      transaction: txn,
    })

    return data
  }
}

export default CategoryQuestionService
