import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { NotificationsAttributes } from 'models/notification'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Notification/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { Notifications } = models

class NotificationsService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Notifications,
      []
    )

    const data = await Notifications.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await Notifications.count({
      include: includeCount,
      where: queryFind.where,
    })
    const deletedNotifications = await Notifications.findAll({
      ...queryFind,
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
      order: order.length ? order : [['createdAt', 'asc']],
    })

    return {
      message: `${total} data has been received.`,
      data: [...data, ...deletedNotifications],
      total,
    }
  }

  /**
   *
   * @param req Request
   */
  public static async getAllDeleted(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Notifications,
      []
    )

    const data = await Notifications.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Notifications.count({
      include: includeCount,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })

    return {
      message: `${total} data has been received.`,
      data,
      total,
    }
  }

  public static async getByUser(req: any, user: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Notifications,
      []
    )

    const data = await Notifications.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        userId: {
          [Op.eq]: user.id,
        },
      },
    })

    const publicNotifications = await Notifications.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        userId: {
          [Op.eq]: null,
        },
      },
    })

    const total = await Notifications.count({
      include: includeCount,
      where: {
        userId: {
          [Op.eq]: user.id,
        },
      },
    })

    return {
      message: `${total} data has been received.`,
      data: [...data, ...publicNotifications],
      total,
    }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string, paranoid: boolean = true) {
    const data = await Notifications.findByPk(id, {
      paranoid,
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
  public static async create(formData: NotificationsAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Notifications.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: NotificationsAttributes) {
    const data = await this.getOne(id)

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
  public static async restoreNotifications(id: string) {
    const data = await this.getOne(id, false)
    await data.restore()
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string, force: boolean = false) {
    const data = await this.getOne(id, !force)
    await data.destroy({
      force,
    })
  }
}

export default NotificationsService
