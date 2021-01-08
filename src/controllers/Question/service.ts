import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { QuestionAttributes } from 'models/question'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Question/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const {
  Question,
  Answer,
  Image,
  QuestionGroup,
  Categories,
  Choice,
  Chapters,
  StudyMaterial,
} = models
const including = [
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
  {
    model: StudyMaterial,
    include: [Image],
  },
]

class QuestionService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Question,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Question.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
      // where: {
      //   parentId: {
      //     [Op.eq]: null,
      //   },
      // },
    })
    const total = await Question.count({
      include: includeCount,
      // where: {
      //   parentId: {
      //     [Op.eq]: null,
      //   },
      // },
    })

    const deletedQuestion = await Question.findAll({
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
      data: [...data, ...deletedQuestion],
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
      Question,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Question.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Question.count({
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
    const data = await Question.findByPk(id, {
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
  public static async create(formData: QuestionAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Question.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: QuestionAttributes) {
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
  public static async restoreQuestion(id: string) {
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

export default QuestionService
