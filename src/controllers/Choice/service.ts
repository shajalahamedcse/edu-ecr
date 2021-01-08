import models from 'models'

import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { ChoiceAttributes } from 'models/choice'
import schema from 'controllers/Choice/schema'

const { Choice } = models

class ChoiceService {
  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(formData: ChoiceAttributes, txn?: Transaction) {
    const values = useValidation(schema.create, formData)
    const data = await Choice.create(values, {
      transaction: txn,
    })

    return data
  }
}

export default ChoiceService
