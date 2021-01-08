import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/role'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Role/schema'
import { Transaction } from 'sequelize/types'
import RolePermissionService from 'controllers/RolePermission/service'

const { Role, Permission } = models
const including = [{ model: Permission }]

class RoleService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Role,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Role.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Role.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await Role.findByPk(id, {
      include: including,
    })

    if (!data) {
      throw new ResponseError.NotFound('data not found or has been deleted')
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async update(
    id: string,
    formData: RoleAttributes,
    txn?: Transaction
  ) {
    const data = await this.getOne(id)
    const { Permissions }: any = formData

    // Check Permissions is Array, format = ['id_1', 'id_2']
    const arrayPermissions = Array.isArray(Permissions)
      ? Permissions
      : JSON.parse(Permissions)

    // Destroy data not in RolePermission
    await RolePermissionService.deleteNotInPermissionId(id, arrayPermissions)

    const listRolePermission = []
    for (let i = 0; i < arrayPermissions.length; i += 1) {
      const PermissionId: string = arrayPermissions[i]
      const formRole = {
        PermissionId,
        RoleId: id,
      }

      // return formRole
      // eslint-disable-next-line no-await-in-loop
      const dataRolePermission = await RolePermissionService.findOrCreate(
        formRole,
        txn
      )
      listRolePermission.push(dataRolePermission)
    }

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {})

    return data
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)
    await data.destroy()
  }
}

export default RoleService
