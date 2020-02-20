const A11yScan = require('../../models/a11y-scan.js')

const addA11yScanResult = async (req, res) => {
  await new A11yScan({result: req.body}).save()
  res.json({ message: 'success' })
}

module.exports = (app) => {
  app.post('/api/v1/scan-result', addA11yScanResult)
}


