import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { StudyMaterialAttributes } from 'models/studymaterial'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/StudyMaterial/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { StudyMaterial, Question, Image } = models
const including = [{ model: Question }, { model: Image }]

class StudyMaterialService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      StudyMaterial,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await StudyMaterial.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await StudyMaterial.count({
      include: includeCount,
      where: queryFind.where,
    })
    const deletedStudyMaterial = await StudyMaterial.findAll({
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
      data: [...data, ...deletedStudyMaterial],
      total,
    }
  }

  /**
   *
   * @param req Request
   */
  public static async getAllDeleted(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      StudyMaterial,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await StudyMaterial.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await StudyMaterial.count({
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
    const data = await StudyMaterial.findByPk(id, {
      include: including,
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
  public static async create(formData: StudyMaterialAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await StudyMaterial.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: StudyMaterialAttributes) {
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
  public static async restoreStudyMaterial(id: string) {
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

export default StudyMaterialService
