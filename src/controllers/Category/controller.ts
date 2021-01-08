import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import CategoriesService from 'controllers/Category/service'

import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  READ_CATEGORY,
  PERMANENTLY_DELETE_CATEGORY,
} from './permissions'

routes.get(
  '/categories',
  [Authorization, checkPermission(READ_CATEGORY)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await CategoriesService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedCategories',
  [Authorization, checkPermission(READ_CATEGORY)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await CategoriesService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreCategory/:id',
  [Authorization, checkPermission(READ_CATEGORY)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await CategoriesService.restoreCategories(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/category/:id',
  [Authorization, checkPermission(READ_CATEGORY)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await CategoriesService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/category',
  [Authorization, checkPermission(CREATE_CATEGORY)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await CategoriesService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/category/:id',
  [Authorization, checkPermission(UPDATE_CATEGORY)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await CategoriesService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/categoryPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_CATEGORY)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await CategoriesService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/category/:id',
  [Authorization, checkPermission(DELETE_CATEGORY)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await CategoriesService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
