module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      body: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isRead: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      userId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notifications')
  },
}
