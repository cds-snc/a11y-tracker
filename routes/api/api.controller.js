const A11yScan = require('../../models/a11y-scan.js')
const ApiKey = require('../../models/api-key.js')
const {SHA256} = require("sha2");

const addA11yScanResult = async (req, res) => {
  const hash = SHA256(`${req.body.key}.${process.env.SALT}`).toString("base64")
  const key = await ApiKey.findOne({key: hash})

  if (!key) { 
    res.status(400).json({ message: 'API key not valid' })
    return
  }

  if (key.revoked === true) { 
    res.status(401).json({ message: 'API key is revoked' })
    return
  }

  try {
    const _json = req.body // JSON data representing one scan 
    await A11yScan.createFromAxeCoreResult(_json.result, _json.project_name, _json.scan_name, _json.revision, key.organisation)  
    res.json({ message: 'Success' })
  } catch(e) {
    res.status(500).json({ message: 'Failed to save! Check schema!' })
  }
}

const scansIndex = async (req, res) => {
  // const _p = new RegExp(req.query.project_name, 'i')
  const _p = new RegExp("vac", 'i')
  const _s = new RegExp("Results", 'i')
  const scans = await A11yScan.find({ project_name: _p, scan_name: _s, timeStamp: { $gte: new Date(2019, 08, 01)}  }, 'timeStamp a11yScore', {sort: {timeStamp: 1}})
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(scans));
}

module.exports = (app) => {
  app.post('/api/v1/scans', addA11yScanResult)
  app.get('/api/scans', scansIndex)
}