import { Request, Response, NextFunction } from 'express'

import UserService from '../controllers/User/service'
import RoleService from '../controllers/Role/service'

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // const { user } = res.locals
    // const userData = await UserService.getOne(user.id)
    // const userRole = userData.Roles

    next()

    // if (userRole && userRole?.length > 0) {
    //   const userPermissions: Array<any> = []

    //   // eslint-disable-next-line no-restricted-syntax
    //   for (const role of userRole) {
    //     // eslint-disable-next-line no-await-in-loop
    //     const roleData = await RoleService.getOne(role.id)
    //     // eslint-disable-next-line array-callback-return
    //     roleData.Permissions?.map((per) => {
    //       userPermissions.push(per.name)
    //     })
    //   }


    //   if (userPermissions.indexOf(permission) === -1) {
    //     return res.status(401).json({
    //       code: 401,
    //       message: 'Insufficient Permission',
    //     })
    //   }
    //   next()
    // } else {
    //   return res.status(401).json({
    //     code: 401,
    //     message: 'Insufficient Permission',
    //   })
    // }
  }
}
