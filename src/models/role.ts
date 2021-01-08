import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'
import { PermissionAttributes } from './permission'
import db from './_instance'

export interface RoleAttributes {
  id: string
  nama: string
  createdAt?: Date
  updatedAt?: Date
  Permissions?: [PermissionAttributes]
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}

const Role = db.sequelize.define<RoleInstance>('Roles', {
  ...SequelizeAttributes.Roles,
})

Role.associate = (models) => {
  Role.belongsToMany(models.Permission, { through: models.RolePermission })
}

export default Role
