import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import AnswerService from 'controllers/Answer/service'

import {
  CREATE_ANSWER,
  UPDATE_ANSWER,
  DELETE_ANSWER,
  READ_ANSWER,
  PERMANENTLY_DELETE_ANSWER,
} from './permissions'

routes.get(
  '/answer',
  [Authorization, checkPermission(READ_ANSWER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await AnswerService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedAnswer',
  [Authorization, checkPermission(READ_ANSWER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await AnswerService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreAnswer/:id',
  [Authorization, checkPermission(READ_ANSWER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await AnswerService.restoreAnswer(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/answer/:id',
  [Authorization, checkPermission(READ_ANSWER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await AnswerService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/answer',
  [Authorization, checkPermission(CREATE_ANSWER)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AnswerService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/answer/:id',
  [Authorization, checkPermission(UPDATE_ANSWER)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await AnswerService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/answerPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_ANSWER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await AnswerService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/answer/:id',
  [Authorization, checkPermission(DELETE_ANSWER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await AnswerService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
