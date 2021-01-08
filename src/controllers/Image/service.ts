import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { ImageAttributes } from 'models/image'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Image/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { Image } = models

class ImageService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Image,
      []
    )

    const data = await Image.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await Image.count({
      include: includeCount,
      where: queryFind.where,
    })

    const deletedImage = await Image.findAll({
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
      data,
      total,
      deletedImage,
    }
  }

  /**
   *
   * @param req Request
   */
  public static async getAllDeleted(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Image,
      []
    )

    const data = await Image.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Image.count({
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

  /**
   *
   * @param id
   */
  public static async getOne(id: string, paranoid: boolean = true) {
    const data = await Image.findByPk(id, {
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
  public static async create(formData: ImageAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Image.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: ImageAttributes) {
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
  public static async restoreImage(id: string) {
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

export default ImageService
