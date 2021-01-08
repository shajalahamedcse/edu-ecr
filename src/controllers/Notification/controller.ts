import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import NotificationsService from 'controllers/Notification/service'
import { currentToken, verifyAccessToken } from 'helpers/Token'
import {
  CREATE_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER,
  READ_CHAPTER,
  PERMANENTLY_DELETE_CHAPTER,
} from './permissions'

routes.get(
  '/notifications',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await NotificationsService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedNotifications',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await NotificationsService.getAllDeleted(
      req
    )
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreNotification/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await NotificationsService.restoreNotifications(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/notification/:id',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await NotificationsService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/userNotification',
  [Authorization, checkPermission(READ_CHAPTER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const getToken = currentToken(req)
    const token = verifyAccessToken(getToken)

    // return res.status(200).json(token?.data?.id)

    const data = await NotificationsService.getByUser(req, token?.data)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/notification',
  [Authorization, checkPermission(CREATE_CHAPTER)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await NotificationsService.create(formData)

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/notification/:id',
  [Authorization, checkPermission(UPDATE_CHAPTER)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await NotificationsService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/notificationPermanent/:id',
  [Authorization, checkPermission(PERMANENTLY_DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await NotificationsService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/notification/:id',
  [Authorization, checkPermission(DELETE_CHAPTER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await NotificationsService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
