const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const db = require('../models')
const Record = db.Record
const User = db.User

router.get('/month/:month', authenticated, (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    const month = req.params.month
    Record.findAll({ where: { UserId: req.user.id } }).then(records => {
      const monthFilter = records.filter(record => {
        return month === record.date.substring(5, 7)
      })
      let totalAmount = 0
      for (record of monthFilter) {
        totalAmount += record.amount
      }
      res.render('index', { records: monthFilter, month, totalAmount })
    })
  })
    .catch(error => {
      res.status(422).json(error)
    })
})

router.get('/category/:category', authenticated, (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    let category = req.params.category

    if (category === 'fas fa-home') {
      category = '家居物業'
    } else if (category === 'fas fa-shuttle-van') {
      category = '交通出行'
    } else if (category === 'fas fa-grin-beam') {
      category = '休閒娛樂'
    } else if (category === 'fas fa-utensils') {
      category = '餐飲食品'
    } else if (category === 'fas fa-pen') {
      category = '其他'
    }

    Record.findAll({ where: { category: req.params.category, UserId: req.user.id } }).then(records => {

      let totalAmount = 0
      for (record of records) {
        totalAmount += record.amount
      }
      res.render('index', { records: records, totalAmount, category })
    })
  })
    .catch(error => {
      res.status(422).json(error)
    })
})


module.exports = router