import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import QuestionService from 'controllers/Question/service'
import AnswerService from 'controllers/Answer/service'
import ChoiceService from 'controllers/Choice/service'

import CategoryQuestionService from 'controllers/CategoryQuestion/service'

import { AnswerAttributes } from 'models/answer'
import { CategoryQuestionAttributes } from 'models/categoryquestion'
import { ChoiceAttributes } from 'models/choice'

import {
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  READ_QUESTION,
  PERMANENTLY_DELETE_QUESTION,
} from './permissions'

routes.get(
  '/question',
  [Authorization, checkPermission(READ_QUESTION)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await QuestionService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedQuestions',
  [Authorization, checkPermission(READ_QUESTION)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await QuestionService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreQuestion/:id',
  [Authorization, checkPermission(READ_QUESTION)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionService.restoreQuestion(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/question/:id',
  [Authorization, checkPermission(READ_QUESTION)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await QuestionService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/question',
  [Authorization, checkPermission(CREATE_QUESTION)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()
    if (!formData.parentId) {
      delete formData.parentId
    }
    const data = await QuestionService.create(formData)

    const answerData: AnswerAttributes = {
      answer: formData.answer,
      description: formData.answerDescription,
      questionId: data.id,
    }

    const answerResponse = await AnswerService.create(answerData)

    if (formData.categories) {
      const categories: string[] = JSON.parse(formData.categories)

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < categories.length; i++) {
        const categoryQuestionData: CategoryQuestionAttributes = {
          questionId: data.id,
          categoryId: categories[i],
        }

        // eslint-disable-next-line no-await-in-loop
        await CategoryQuestionService.create(categoryQuestionData)
      }
    }

    const choices: any[] = []
    const choice: ChoiceAttributes[] = JSON.parse(formData.choice)

    if (formData.choice && choice[0].choice) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < choice.length; i++) {
        const choiceData: ChoiceAttributes = {
          choice: choice[i].choice,
          questionId: data.id,
          letter: choice[i].letter,
        }

        // eslint-disable-next-line no-await-in-loop
        const choiceRes = await ChoiceService.create(choiceData)
        choices.push(choiceRes.id)
      }
    }

    const buildResponse = BuildResponse.created({
      data,
      answerResponse,
      choices,
    })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/question/:id',
  [Authorization, checkPermission(UPDATE_QUESTION)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await QuestionService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/questionPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_QUESTION)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/question/:id',
  [Authorization, checkPermission(DELETE_QUESTION)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
