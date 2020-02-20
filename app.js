// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const cookieSession = require('cookie-session')
const cookieSessionConfig = require('./config/cookieSession.config')
const { hasData, contextMiddleware } = require('./utils')
const { addNunjucksFilters } = require('./filters')
const csp = require('./config/csp.config')
const csrf = require('csurf')
const apiController = require('./api.controller')

// check to see if we have a custom configRoutes function
let { routes, locales } = require('./config/routes.config')

const { configRoutes } = require('./utils/route.helpers')
if (!locales) locales = ['en', 'fr']

require('./db')

// initialize application.
const app = express()

app.use(bodyParser.json({limit: '2mb'})) // the JSON payloads we are expecting from axe-scans are quite big
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// CSRF setup
const csrfMiddleware = csrf({cookie: true, signed: true })

locales.forEach((locale) => {
  app.use(`/${locale}`, csrfMiddleware, function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
  })
})

app.post('/api/v1/scan-result', apiController.addA11yScanResult)

// in production: use redis for sessions
// but this works for now
app.use(cookieSession(cookieSessionConfig))

// public assets go here (css, js, etc)
app.use(express.static(path.join(__dirname, 'public')))

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet())
app.use(helmet.contentSecurityPolicy({ directives: csp }))
// gzip response body compression.
app.use(compression())

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null
app.locals.hasData = hasData

// set default views path
app.locals.basedir = path.join(__dirname, './views')
app.set('views', [path.join(__dirname, './views')])

// add in helpers for scoped data contexts (used in the repeater)
app.use(contextMiddleware)

app.routes = configRoutes(app, routes, locales)

// view engine setup
const nunjucks = require('nunjucks')

const env = nunjucks
  .configure([...app.get('views'), 'views/macros'], {
    autoescape: true,
    express: app,
  })
  .addGlobal('$env', process.env)

addNunjucksFilters(env)

nunjucks.installJinjaCompat()

app.set('view engine', 'njk')

module.exports = app
