import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface RolePermissionAttributes {
  id?: string
  PermissionId: string
  RoleId: string
  createdAt?: Date
  updatedAt?: Date
}

interface RolePermissionCreationAttributes
  extends Optional<RolePermissionAttributes, 'id'> {}

interface RolePermissionInstance
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>,
    RolePermissionAttributes {}

const RolePermission = db.sequelize.define<RolePermissionInstance>(
  'RolePermissions',
  {
    ...SequelizeAttributes.RolePermissions,
  }
)

export default RolePermission
