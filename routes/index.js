'use strict';

const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Todo = require('../models/todo');
const uuid = require('uuid');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

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

router.get('/create', authenticationEnsurer, csrfProtection, (req, res, next) => {
  res.render('create', {
    csrfToken: req.csrfToken(),
  });
});

router.post('/create', authenticationEnsurer, csrfProtection, (req, res, next) => {
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

router.get('/edit/:todoId', authenticationEnsurer, csrfProtection, (req, res, next) => {
  Todo.findOne({
    where: {
      todoId: req.params.todoId,
    }
  }).then((todo) => {
    res.render('edit', {
      todo: todo,
      csrfToken: req.csrfToken(),
    });
  });
});

router.post('/edit/:todoId', authenticationEnsurer, csrfProtection, (req, res, next) => {
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
