const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

//dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//setting method-override
app.use(methodOverride('_method'))

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting css
app.use(express.static('public'))

//setting mongodb
mongoose.set('debug', true)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection

//連線異常
db.on('error', () => {
  console.log('mongodb error')
})

//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//setting session
app.use(session({
  secret: 'key',
  resave: 'false',
  saveUninitialized: 'false'
}))

//setting connect-flash
app.use(flash())

//setting passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})


//setting routers
app.use('/', require('./routes/home'))
// app.use('/record', require('./routes/record'))
// app.use('/filter', require('./routes/filter'))
app.use('/users', require('./routes/user'))
// app.use('/auth', require('./routes/auths'))

app.listen(process.env.PORT || 3000, () => {
  console.log('Express is running on http://localhost:3000')
})