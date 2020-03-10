const A11yScan = require('../../models/a11y-scan.js')
const axeRules = require('./data/axe-rules.json')

let props = {
  finalScan: {}, // a real axe result representing the final scan in the mock series, from which the back dated mock results will be inferred
  project_name: "Mock Project",
  scan_name: "Mock Scan",
  revision: "Mock hash",
  organisation: "cdssnc",
  scanSeriesStartDate: new Date('2018-02-09T16:20:00'), 
  scanFrequency: 7 // number of days between scans,
}

const createMockScanSeries = async (config) => { 
  props = Object.assign(props, config)
  
  let 
  scanDate = props.scanSeriesStartDate, 
  scanSeriesEndDate = Date.now(),
  result = {},
  _p = props

  // _applicableRules = finalScanResult.violations.concat(finalScanResult.passes)
  // applicableRuleIds = _applicableRules.map((rule) => { return rule.id })

  while (scanDate <= scanSeriesEndDate) {
    result = await newMockScanResult(scanDate)
    await A11yScan.createFromAxeCoreResult(result, _p.project_name, _p.scan_name, _p.revision, _p.organisation)
    
    scanDate.setDate(scanDate.getDate() + _p.scanFrequency)
  }
  return true
} 

const newMockScanResult = async (date) => {
  const _s = props.finalScan
  let mockResult = {
    violations: props.finalScan.violations,
    passes: props.finalScan.passes,
    incomplete: props.finalScan.incomplete,
    inapplicable: props.finalScan.inapplicable,
    "testEngine": _s.testEngine,
    "testRunner": _s.testRunner,
    "testEnvironment": _s.testEnvironment,
    "timestamp": date.toISOString(),
    "url": _s.url,
    "toolOptions": _s.toolOptions,
  }
  return mockResult
}

module.exports = createMockScanSeries