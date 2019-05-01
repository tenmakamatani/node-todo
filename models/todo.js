'use strict';

const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Todo = loader.database.define('todos', {
  todoId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  detail: {
    type: Sequelize.TEXT,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      fields: ['userId'],
    }
  ]
});

module.exports = Todo;