const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const db = require('../models')
const Record = db.Record
const User = db.User

router.get('/', authenticated, (req, res) => {
  const user = User.findByPk(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    Record.findAll({ where: { UserId: req.user.id } }).then(records => {
      let totalAmount = 0
      for (record of records) {
        totalAmount += record.amount
      }
      res.render('index', { records, totalAmount})
    })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})


module.exports = router