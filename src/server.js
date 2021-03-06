const path = require('path')
const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const passport = require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const routes = require('./routes')
const config = require('../config')

const port = process.env.PORT || 3000

const app = express()

require('pug')
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressValidator())

app.use(session({
  store: new pgSession({
      conString : 'postgres://localhost:5432/vinyl'
   }),
   secret: config.SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000
   },
   secure : true
 }))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  res.locals.moment = require('moment')
  next();
})

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use('/', routes)

app.use((req, res) => {
  res.status(404).render('not_found')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
