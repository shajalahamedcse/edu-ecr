import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { ChaptersAttributes } from 'models/chapter'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Chapter/schema'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const {
  Chapters,
  Question,
  Subject,
  StudyMaterial,
  Image,
  QuestionGroup,
  Answer,
  Categories,
  Choice,
} = models
const including = [
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
          {
            model: StudyMaterial,
            include: [Image],
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
    ],
  },
  { model: Subject },
]

class ChaptersService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: any) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      Chapters,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Chapters.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'asc']],
    })
    const total = await Chapters.count({
      include: includeCount,
      where: queryFind.where,
    })
    const deletedChapter = await Chapters.findAll({
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
      data: [...data, ...deletedChapter],
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
      Chapters,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Chapters.findAll({
      ...queryFind,
      order: order.length ? order : [['deletedAt', 'desc']],
      paranoid: false,
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const total = await Chapters.count({
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
    const data = await Chapters.findByPk(id, {
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
  public static async create(formData: ChaptersAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Chapters.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: ChaptersAttributes) {
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
  public static async restoreChapters(id: string) {
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

export default ChaptersService
