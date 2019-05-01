'use strict';

const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Todo = require('../models/todo');
const uuid = require('uuid');

/* GET home page. */
router.get('/', authenticationEnsurer, (req, res, next) => {
  Todo.findAll({
    where: {
      userId: req.user.id
    },
    order: [['updatedAt', 'DESC']]
  }).then((todos) => {
    res.render('index', {
      todos: todos,
      user: req.user,
    });
  });
});

router.get('/create', authenticationEnsurer, (req, res, next) => {
  res.render('create');
});

router.post('/create', authenticationEnsurer, (req, res, next) => {
  Todo.create({
    todoId: uuid.v4(),
    userId: req.user.id,
    name: req.body.name,
    detail: req.body.detail,
    updatedAt: new Date(),
  }).then(() => {
    res.redirect('/');
  });
});

router.get('/delete/:todoId', authenticationEnsurer, (req, res, next) => {
  Todo.findOne({
    where: {
      todoId: req.params.todoId,
    }
  }).then((todo) => {
    todo.destroy().then(() => {
      res.redirect('/');
    });
  });
});

router.get('/edit/:todoId', authenticationEnsurer, (req, res, next) => {
  Todo.findOne({
    where: {
      todoId: req.params.todoId,
    }
  }).then((todo) => {
    res.render('edit', {
      todo: todo,
    });
  });
});

router.post('/edit/:todoId', authenticationEnsurer, (req, res, next) => {
  Todo.findOne({
    where: {
      todoId: req.params.todoId,
    }
  }).then((todo) => {
    todo.update({
      todoId: req.params.todoId,
      userId: req.user.id,
      name: req.body.name,
      detail: req.body.detail,
      updatedAt: new Date(),
    }).then(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
