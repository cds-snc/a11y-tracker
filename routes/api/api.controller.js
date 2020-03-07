const A11yScan = require('../../models/a11y-scan.js')

const addA11yScanResult = async (req, res) => {
  try {
    const _json = req.body // JSON data representing one scan 
    await A11yScan.insertAxeCoreResult(_json.result, _json.project_name, _json.scan_name, _json.revision)  
    res.json({ message: 'success' })
  } catch {
    res.json({ message: 'Failed to save! Check schema!' })
  }
}

module.exports = (app) => {
  app.post('/api/v1/scan-result', addA11yScanResult)
}