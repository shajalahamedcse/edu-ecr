import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import StudyMaterialService from 'controllers/StudyMaterial/service'

import {
  CREATE_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER,
  READ_CHAPTER,
  PERMANENTLY_DELETE_CHAPTER,
} from './permissions'

routes.get(
  '/studyMaterial',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await StudyMaterialService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedStudyMaterial',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await StudyMaterialService.getAllDeleted(
      req
    )
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreStudyMaterial/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await StudyMaterialService.restoreStudyMaterial(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/studyMaterial/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await StudyMaterialService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/studyMaterial',
  [Authorization, checkPermission(CREATE_CHAPTER)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await StudyMaterialService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/studyMaterial/:id',
  [Authorization, checkPermission(UPDATE_CHAPTER)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await StudyMaterialService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/studyMaterialPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await StudyMaterialService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/studyMaterial/:id',
  [Authorization, checkPermission(DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await StudyMaterialService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
