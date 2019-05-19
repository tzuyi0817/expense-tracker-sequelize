const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const db = require('./models')
const Record = db.Record
const User = db.User

router.get('/', authenticated, (req, res) => {
  const user = User.findByPK(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    let totalAmount = 0
    for (record of records) {
      totalAmount += record.amount
    }

    Record.findAll({ where: { userId: req.user.id } }).then(records => {
      res.render('index', { records, totalAmount })
    })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})


module.exports = router