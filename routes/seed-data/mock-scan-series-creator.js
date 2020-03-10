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
    await A11yScan.insertAxeCoreResult(result, _p.project_name, _p.scan_name, _p.revision, _p.organisation)
    
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

// const createMockA11yScanModel = async function(axeResultObj, date, projectName, scanName, revision, organisation) {
//   const _newModel = new A11yScan({
//     url: axeResultObj.url, 
//     testEnvironment: axeResultObj.testEnvironment, 
//     timeStamp: date,
//     violations: axeResultObj.violations,
//     passes: axeResultObj.passes,
//     incomplete: axeResultObj.incomplete,
//     inapplicable: axeResultObj.inapplicable,
//     axe_meta_data: {
//       testEngine: axeResultObj.testEngine,
//       testRunner: axeResultObj.testRunner,
//       toolOptions: axeResultObj.toolOptions,
//     },
//     project_name: projectName,
//     scan_name: scanName,
//     revision: revision,
//     organisation: organisation,
//   })

//   return _newModel
// }


  // if(previousScan === undefined) {
  //   console.log(date.toString())
  //   console.log(applicableRuleIds)
  //   // 
  // }