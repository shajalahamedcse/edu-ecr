import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { GradeAttributes } from 'models/grade'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Grade/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { Grade, Subject, User } = models
const including = [{ model: Subject }]

class GradeService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Grade,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Grade.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await Grade.count({
      include: includeCount,
      where: queryFind.where,
    })

    const deletedGrade = await Grade.findAll({
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
      data: [...data, ...deletedGrade],
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
      Grade,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Grade.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Grade.count({
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
    const data = await Grade.findByPk(id, {
      include: including,
      paranoid,
    })

    const users = await User.findAll({
      paranoid: false,
      where: {
        grade: {
          [Op.eq]: id,
        },
      },
    })

    if (!data) {
      throw new ResponseError.NotFound('data not found or has been deleted')
    }

    return { data, users }
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: GradeAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Grade.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: GradeAttributes) {
    const { data } = await this.getOne(id)

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
  public static async restoreGrade(id: string) {
    const { data } = await this.getOne(id, false)
    await data.restore()
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string, force: boolean = false) {
    const { data } = await this.getOne(id, !force)
    await data.destroy({
      force,
    })
  }
}

export default GradeService
