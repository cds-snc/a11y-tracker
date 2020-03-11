const A11yScan = require('../../models/a11y-scan.js')
const allAxeRules = require('./data/axe-rules.json')

let props = {
  finalScanResult: {}, // a real axe result representing the final scan in the mock series, from which the back dated mock results will be inferred
  project_name: "Mock Project",
  scan_name: "Mock Scan",
  revision: "Mock hash",
  organisation: "cdssnc",
  scanSeriesStartDate: new Date('2018-02-09T16:20:00'), 
  scanFrequency: 7, // number of days between scans
  relevantAxeRules: allAxeRules 
}

const createMockScanSeries = async (config) => { 
  props = Object.assign(props, config)
  props.relevantAxeRules =  getRelevantAxeRules()
  // console.log(props.relevantAxeRules)
  
  let scanDate = props.scanSeriesStartDate, 
  scanSeriesEndDate = Date.now(),
  result = {},
  _p = props

  while (scanDate <= scanSeriesEndDate) {
    newResult = await newMockScanResult(scanDate)
    await A11yScan.createFromAxeCoreResult(newResult, _p.project_name, _p.scan_name, _p.revision, _p.organisation)

    scanDate.setDate(scanDate.getDate() + _p.scanFrequency)
  }
  return true
} 

const newMockScanResult = async (date) => {
  const _sr = props.finalScanResult,
  mockRuleSpread = generateMockRuleSpread()

  let mockResult = {
    violations: mockRuleSpread.violations,
    passes: mockRuleSpread.passes,
    incomplete: [],
    inapplicable: [],
    "testEngine": _sr.testEngine,
    "testRunner": _sr.testRunner,
    "testEnvironment": _sr.testEnvironment,
    "timestamp": date.toISOString(),
    "url": _sr.url,
    "toolOptions": _sr.toolOptions,
  }
  return mockResult
}

const generateMockRuleSpread = () => {
  const nRules = props.relevantAxeRules.length,
  rando = getRandomInt(nRules)

  let mockRulesSpread = {
    violations: [],
    passes: []
  }

  props.relevantAxeRules.forEach((rule, index) => {
    if (rando % (index+1)) {
      mockRulesSpread.passes.push(rule)
    } else {
      mockRulesSpread.violations.push(rule)
    }
  })
  return mockRulesSpread
}

const getRelevantAxeRules = () => {
  let _fsr = props.finalScanResult
  
  const finalScanRules = [..._fsr.violations, ..._fsr.passes],
  relevantAxeRuleIds = finalScanRules.map(rule => rule.id),
  rules =  allAxeRules.filter(rule => relevantAxeRuleIds.includes(rule.ruleId))
  
  return rules
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = createMockScanSeries