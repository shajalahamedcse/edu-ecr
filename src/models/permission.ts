import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface PermissionAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
}

interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, 'id'> {}

interface PermissionInstance
  extends Model<PermissionAttributes, PermissionCreationAttributes>,
    PermissionAttributes {}

const Permission = db.sequelize.define<PermissionInstance>('Permissions', {
  ...SequelizeAttributes.Permissions,
})

export default Permission
