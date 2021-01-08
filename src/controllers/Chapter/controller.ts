import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import ChaptersService from 'controllers/Chapter/service'

import {
  CREATE_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER,
  READ_CHAPTER,
  PERMANENTLY_DELETE_CHAPTER,
} from './permissions'

routes.get(
  '/chapters',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ChaptersService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedChapters',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ChaptersService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreChapter/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await ChaptersService.restoreChapters(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/chapter/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await ChaptersService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/chapter',
  [Authorization, checkPermission(CREATE_CHAPTER)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await ChaptersService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/chapter/:id',
  [Authorization, checkPermission(UPDATE_CHAPTER)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await ChaptersService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/chapterPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ChaptersService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/chapter/:id',
  [Authorization, checkPermission(DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ChaptersService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
