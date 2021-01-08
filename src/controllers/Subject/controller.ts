import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import SubjectService from 'controllers/Subject/service'

import {
  CREATE_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  READ_SUBJECT,
  PERMANENTLY_DELETE_SUBJECT,
} from './permissions'

routes.get(
  '/subject',
  [Authorization, checkPermission(READ_SUBJECT)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await SubjectService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedSubjects',
  [Authorization, checkPermission(READ_SUBJECT)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await SubjectService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreSubject/:id',
  [Authorization, checkPermission(READ_SUBJECT)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await SubjectService.restoreSubject(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/subject/:id',
  [Authorization, checkPermission(READ_SUBJECT)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await SubjectService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/subject',
  [Authorization, checkPermission(CREATE_SUBJECT)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await SubjectService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/subject/:id',
  [Authorization, checkPermission(UPDATE_SUBJECT)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await SubjectService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/subjectPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_SUBJECT)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await SubjectService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/subject/:id',
  [Authorization, checkPermission(DELETE_SUBJECT)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await SubjectService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
