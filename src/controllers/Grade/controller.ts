import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import GradeService from 'controllers/Grade/service'

import {
  CREATE_GRADE,
  UPDATE_GRADE,
  DELETE_GRADE,
  READ_GRADE,
  PERMANENTLY_DELETE_GRADE,
} from './permissions'

routes.get(
  '/grade',
  [Authorization, checkPermission(READ_GRADE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await GradeService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedGrades',
  [Authorization, checkPermission(READ_GRADE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await GradeService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreGrade/:id',
  [Authorization, checkPermission(READ_GRADE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await GradeService.restoreGrade(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/grade/:id',
  [Authorization, checkPermission(READ_GRADE)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const { data, users } = await GradeService.getOne(id)
    const buildResponse = BuildResponse.get({ data, users })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/grade',
  [Authorization, checkPermission(CREATE_GRADE)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await GradeService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/grade/:id',
  [Authorization, checkPermission(UPDATE_GRADE)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await GradeService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/gradePermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_GRADE)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await GradeService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/grade/:id',
  [Authorization, checkPermission(DELETE_GRADE)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await GradeService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
