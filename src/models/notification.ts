import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface NotificationsAttributes {
  id: string
  title: string
  body: string
  isRead: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface NotificationsCreationAttributes
  extends Optional<NotificationsAttributes, 'id'> {}

interface NotificationsInstance
  extends Model<NotificationsAttributes, NotificationsCreationAttributes>,
    NotificationsAttributes {}

const Notifications = db.sequelize.define<NotificationsInstance>(
  'Notifications',
  {
    ...SequelizeAttributes.Notifications,
  },
  { paranoid: true }
)

Notifications.associate = (models) => {
  Notifications.belongsTo(models.User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
}

export default Notifications
