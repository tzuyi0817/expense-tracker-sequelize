const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const db = require('./models')
const Record = db.Record
const User = db.User

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
app.use('/record', require('./routes/record'))
// app.use('/filter', require('./routes/filter'))
app.use('/users', require('./routes/user'))
// app.use('/auth', require('./routes/auths'))

app.listen(process.env.PORT || 3000, () => {
  db.sequelize.sync()
  console.log('Express is running on http://localhost:3000')
})