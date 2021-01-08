module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('RolePermissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      PermissionId: {
        type: Sequelize.UUID,
      },
      RoleId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RolePermissions')
  },
}
