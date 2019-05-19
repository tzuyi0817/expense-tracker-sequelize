const express = require('express')
const router = express.Router()
const moment = require('moment')
const { authenticated } = require('../config/auth')
const db = require('../models')
const Record = db.Record
const User = db.User

//新增一筆支出頁面
router.get('/new', authenticated, (req, res) => {
  const today = moment().format('YYYY-MM-DD')
  res.render('new', { today })
})

//新增一筆支出
router.post('/new', authenticated, (req, res) => {
  const record = Record({ ...req.body, UserId: req.user.id })

  record.save(err => {
    if (err) return console.log(err)
    res.redirect('/')
  })

})

//編輯頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    Record.findOne({ where: { Id: req.params.id, UserId: req.user.id } }).then(record => {

      let optionASelected = false
      let optionBSelected = false
      let optionCSelected = false
      let optionDSelected = false
      let optionESelected = false
      if (record.category === 'fas fa-home') {
        optionASelected = true
      } else if (record.category === 'fas fa-shuttle-van') {
        optionBSelected = true
      } else if (record.category === 'fas fa-grin-beam') {
        optionCSelected = true
      } else if (record.category === 'fas fa-utensils') {
        optionDSelected = true
      } else if (record.category === 'fas fa-pen') {
        optionESelected = true
      }

      res.render('edit', { record, optionASelected, optionBSelected, optionCSelected, optionDSelected, optionESelected })
    })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})


//編輯資料
router.put('/:id', authenticated, (req, res) => {
  Record.findOne({ where: { Id: req.params.id, UserId: req.user.id } }).then(record => {
    Object.assign(record, req.body)

    record.save(err => {
      if (err) return console.log(err)
      res.redirect(`/`)
    })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})

//刪除資料
router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if (!user) {
      return res.error()
    }

    Record.destroy({ where: { Id: req.params.id, UserId: req.user.id } }).then(record => {
      res.redirect('/')
    })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})

module.exports = router