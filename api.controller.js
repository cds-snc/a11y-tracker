const A11yScan = require('./models/a11y-scan.js')

exports.addA11yScanResult = async (req, res) => {
  await new A11yScan({result: req.body}).save()
  res.json({ message: 'success' })
}