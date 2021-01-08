import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import QuestionGroupService from 'controllers/QuestionGroup/service'

import {
  CREATE_QUESTIONGROUP,
  UPDATE_QUESTIONGROUP,
  DELETE_QUESTIONGROUP,
  READ_QUESTIONGROUP,
  PERMANENTLY_DELETE_QUESTIONGROUP,
} from './permissions'

routes.get(
  '/questionGroup',
  [Authorization, checkPermission(READ_QUESTIONGROUP)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await QuestionGroupService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedQuestionGroups',
  [Authorization, checkPermission(READ_QUESTIONGROUP)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await QuestionGroupService.getAllDeleted(
      req
    )
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreQuestionGroup/:id',
  [Authorization, checkPermission(READ_QUESTIONGROUP)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionGroupService.restoreQuestionGroup(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/questionGroup/:id',
  [Authorization, checkPermission(READ_QUESTIONGROUP)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await QuestionGroupService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/questionGroup',
  [Authorization, checkPermission(CREATE_QUESTIONGROUP)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await QuestionGroupService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/questionGroup/:id',
  [Authorization, checkPermission(UPDATE_QUESTIONGROUP)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await QuestionGroupService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/questionGroupPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_QUESTIONGROUP)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionGroupService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/questionGroup/:id',
  [Authorization, checkPermission(DELETE_QUESTIONGROUP)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await QuestionGroupService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
