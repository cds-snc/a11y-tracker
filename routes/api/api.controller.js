const A11yScan = require('../../models/a11y-scan.js')
const ApiKey = require('../../models/api-key.js')
const {SHA256} = require("sha2");

const addA11yScanResult = async (req, res) => {
  hash = SHA256(`${req.body.key}.${process.env.SALT}`).toString("base64")
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

    const newA11yScanModel = new A11yScan({
      url: _json.result.url,
      testEnvironment: _json.result.testEnvironment,
      timeStamp: _json.result.timestamp,
      violations: _json.result.violations,
      passes: _json.result.passes,
      incomplete: _json.result.incomplete,
      inapplicable: _json.result.inapplicable,
      axe_meta_data: {
        testEngine: _json.result.testEngine,
        testRunner: _json.result.testRunner,
        toolOptions: _json.result.toolOptions,
      },
      project_name: _json.project_name,
      scan_name: _json.scan_name,
      revision: _json.revision,
      organisation: key.organisation,
    })
    await newA11yScanModel.save()  
    res.json({ message: 'Success' })
  } catch(e) {
    res.status(500).json({ message: 'Failed to save! Check schema!' })
  }
}

module.exports = (app) => {
  app.post('/api/v1/scans', addA11yScanResult)
}