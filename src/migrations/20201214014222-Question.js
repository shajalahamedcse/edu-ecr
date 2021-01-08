module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      choice: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      parentId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      questionType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      serialNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      questionGroupId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      categoryId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      chapterId: {
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
    await queryInterface.dropTable('Questions')
  },
}
