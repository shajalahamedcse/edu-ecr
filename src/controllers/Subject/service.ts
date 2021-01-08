import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { SubjectAttributes } from 'models/subject'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Subject/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { Subject, ExamType, Grade, Categories, Chapters } = models
const including = [
  { model: ExamType },
  { model: Grade },
  { model: Categories },
  { model: Chapters },
]

class SubjectService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Subject,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Subject.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await Subject.count({
      include: includeCount,
      where: queryFind.where,
    })

    const deletedSubject = await Subject.findAll({
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
      data: [...data, ...deletedSubject],
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
      Subject,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Subject.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Subject.count({
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
    const data = await Subject.findByPk(id, {
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
  public static async create(formData: SubjectAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Subject.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: SubjectAttributes) {
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
  public static async restoreSubject(id: string) {
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

export default SubjectService
