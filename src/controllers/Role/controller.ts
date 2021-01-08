import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import { checkPermission } from 'middlewares/Permission'

import BuildResponse from 'modules/Response/BuildResponse'
import RoleService from 'controllers/Role/service'
import { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE, READ_ROLE } from './permissions'

routes.get(
  '/role',
  [Authorization, checkPermission(READ_ROLE)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await RoleService.getAll(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/role/:id',
  [Authorization, checkPermission(READ_ROLE)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await RoleService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role',
  [Authorization, checkPermission(CREATE_ROLE)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RoleService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/role/:id',
  [Authorization, checkPermission(UPDATE_ROLE)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData, txn)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/role/:id',
  [Authorization, checkPermission(DELETE_ROLE)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
