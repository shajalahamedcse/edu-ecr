import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { QuestionGroupAttributes } from 'models/questiongroup'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/QuestionGroup/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const {
  QuestionGroup,
  Year,
  Question,
  Answer,
  Image,
  Categories,
  Chapters,
  Choice,
} = models
const including = [
  { model: Year },
  {
    model: Question,
    include: [
      {
        model: Question,
        as: 'SubQuestions',
        include: [
          {
            model: Question,
            as: 'SubQuestions',
            include: [
              { model: Question, as: 'SubQuestions' },
              {
                model: Answer,
                include: [Image],
              },
              {
                model: Image,
              },
            ],
          },
          {
            model: Answer,
            include: [Image],
          },
          {
            model: Image,
          },
          {
            model: Answer,
            include: [Image],
          },
          {
            model: Image,
          },
          {
            model: QuestionGroup,
          },
          {
            model: Categories,
          },
          {
            model: Choice,
            include: [Image],
          },
          {
            model: Chapters,
          },
        ],
      },
      {
        model: Answer,
        include: [Image],
      },
      {
        model: Image,
      },
      {
        model: QuestionGroup,
      },
      {
        model: Categories,
      },
      {
        model: Choice,
        include: [Image],
      },
      {
        model: Chapters,
      },
    ],
  },
]

class QuestionGroupService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      QuestionGroup,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await QuestionGroup.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await QuestionGroup.count({
      include: includeCount,
      where: queryFind.where,
    })

    const deletedQuestionGroup = await QuestionGroup.findAll({
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
      data: [...data, ...deletedQuestionGroup],
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
      QuestionGroup,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await QuestionGroup.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await QuestionGroup.count({
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
    const data = await QuestionGroup.findByPk(id, {
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
  public static async create(formData: QuestionGroupAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await QuestionGroup.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: QuestionGroupAttributes) {
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
  public static async restoreQuestionGroup(id: string) {
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

export default QuestionGroupService
