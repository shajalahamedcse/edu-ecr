module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Choices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      letter: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      choice: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      questionId: {
        allowNull: false,
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
    await queryInterface.dropTable('Choices')
  },
}
