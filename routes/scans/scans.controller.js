const A11yScan = require('../../models/a11y-scan.js')

module.exports = (app, route) => {
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  const loadScans = async (req, res, next) => {
    res.locals.scans = await A11yScan.find({})
    next()
  } 

  route.draw(app).use(loadScans).get(route.render())
}