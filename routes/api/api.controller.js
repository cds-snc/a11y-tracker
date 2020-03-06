const A11yScan = require('../../models/a11y-scan.js')

const addA11yScanResult = async (req, res) => {
  const _json = JSON.parse(req.body) // JSON data representing one scan 

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
  })

  await newA11yScanModel.save()  
  res.json({ message: 'success' })
}

module.exports = (app) => {
  app.post('/api/v1/scan-result', addA11yScanResult)
}