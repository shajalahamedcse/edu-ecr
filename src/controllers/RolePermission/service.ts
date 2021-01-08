import models from 'models'
import db from 'models/_instance'
import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { RolePermissionAttributes } from 'models/rolepermission'
import schema from 'controllers/RolePermission/schema'

const { Sequelize } = db
const { Op } = Sequelize

const { RolePermission } = models

class RolePermissionService {
  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(
    formData: RolePermissionAttributes,
    txn?: Transaction
  ) {
    const values = useValidation(schema.create, formData)
    const data = await RolePermission.create(values, {
      transaction: txn,
    })

    return data
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async findOrCreate(
    formData: RolePermissionAttributes,
    txn?: Transaction
  ) {
    const values = useValidation(schema.create, formData)

    const data = await RolePermission.findOrCreate({
      where: values,
    })

    return data
  }

  /**
   *
   * @param id
   */
  public static async deleteByRoleId(id: string) {
    await RolePermission.destroy({
      where: {
        RoleId: {
          [Op.in]: id,
        },
      },
    })
  }

  /**
   *
   * @param id
   * @param roles Array of String
   * @example
   * permissions = ['id_1', 'id_2']
   */
  public static async deleteNotInPermissionId(id: string, permissions: []) {
    await RolePermission.destroy({
      where: {
        RoleId: id,
        PermissionId: {
          [Op.notIn]: permissions,
        },
      },
    })
  }
}

export default RolePermissionService
