import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import YearService from 'controllers/Year/service'
import ExamTypeService from 'controllers/ExamType/service'

// import { YearAttributes } from 'models/year'

import {
  CREATE_YEAR,
  UPDATE_YEAR,
  DELETE_YEAR,
  READ_YEAR,
  PERMANENTLY_DELETE_YEAR,
} from './permissions'

routes.get(
  '/year',
  [Authorization, checkPermission(READ_YEAR)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await YearService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedYear/:id',
  [Authorization, checkPermission(READ_YEAR)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    const { message, data, total } = await YearService.getAllDeleted(req, id)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreYear/:id',
  [Authorization, checkPermission(READ_YEAR)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await YearService.restoreYear(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/year/:id',
  [Authorization, checkPermission(READ_YEAR)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await YearService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/year',
  [Authorization, checkPermission(CREATE_YEAR)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const examData = await ExamTypeService.getOne(formData.examTypeId)

    const data = await YearService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/year/:id',
  [Authorization, checkPermission(UPDATE_YEAR)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await YearService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/yearPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_YEAR)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await YearService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/year/:id',
  [Authorization, checkPermission(DELETE_YEAR)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await YearService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
