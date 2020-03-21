const A11yScan = require('../../models/a11y-scan.js')

const show = async (req, res) => {
  res.render('project', { id: req.params.id })
}

module.exports = (app) => {
  app.get('/project/:id', show)
}
