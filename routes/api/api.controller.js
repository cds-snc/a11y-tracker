const A11yScan = require('../../models/a11y-scan.js')

const addA11yScanResult = async (req, res) => {
  await new A11yScan({result: req.body}).save()
  A11yScan.count({}, (err, scanCount) => {
    console.log(`Number of scans is now ${scanCount}`)
  });
  res.json({ message: 'success' })
}

module.exports = (app) => {
  app.post('/api/v1/scan-result', addA11yScanResult)
}


