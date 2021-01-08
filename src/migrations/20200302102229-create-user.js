module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      referralCode: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      referredByCode: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      language: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      grade: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      method: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      tokenVerify: {
        defaultValue: null,
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
    })

    await queryInterface.addConstraint('Users', {
      type: 'unique',
      fields: ['email'],
      name: 'UNIQUE_USERS_EMAIL',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  },
}
