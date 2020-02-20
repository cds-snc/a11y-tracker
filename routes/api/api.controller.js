const A11yScan = require('../../models/a11y-scan.js')

const addA11yScanResult = async (req, res) => {
  await new A11yScan({result: req.body}).save()
  A11yScan.countDocuments({}, (err, nScans) => {
    console.log("You've inserted a new result into the A11yScan DB table")
    console.log(`There are now ${nScans} scans in the table`)
  });
  res.json({ message: 'success' })
}

module.exports = (app) => {
  app.post('/api/v1/scan-result', addA11yScanResult)
}


