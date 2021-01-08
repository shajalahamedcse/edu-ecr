import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'

import ExamTypeService from 'controllers/ExamType/service'

import {
  CREATE_EXAMTYPE,
  UPDATE_EXAMTYPE,
  DELETE_EXAMTYPE,
  READ_EXAMTYPE,
  PERMANENTLY_DELETE_EXAMTYPE,
} from './permissions'

routes.get(
  '/examType',
  [Authorization, checkPermission(READ_EXAMTYPE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ExamTypeService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedExamTypes',
  [Authorization, checkPermission(READ_EXAMTYPE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ExamTypeService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreExamType/:id',
  [Authorization, checkPermission(READ_EXAMTYPE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await ExamTypeService.restoreExamType(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/examType/:id',
  [Authorization, checkPermission(READ_EXAMTYPE)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await ExamTypeService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/examType',
  [Authorization, checkPermission(CREATE_EXAMTYPE)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await ExamTypeService.create(formData)
    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/examType/:id',
  [Authorization, checkPermission(UPDATE_EXAMTYPE)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await ExamTypeService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/examTypePermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_EXAMTYPE)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ExamTypeService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/examType/:id',
  [Authorization, checkPermission(DELETE_EXAMTYPE)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ExamTypeService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
