const A11yScan = require('../../models/a11y-scan.js')
const allAxeRules = require('./data/axe-rules.json')

let props = {
  finalScanResult: {}, // a real axe result representing the final scan in the mock series, from which the back dated mock results will be inferred
  project_name: "Mock Project",
  scan_name: "Mock Scan",
  revision: "Mock hash",
  organisation: "cdssnc",
  seriesStartDate: new Date('2018-02-09T16:20:00'),
  seriesEndDate: new Date('2020-02-09T16:20:00'), 
  scanFrequency: 7, // number of days between scans
  axeRulesForSeries: allAxeRules,
}

const createMockScanSeries = async (config) => { 
  props.seriesEndDate = new Date()
  props = Object.assign(props, config)
  props.axeRulesForSeries =  getAxeRulesForSeries()
  props.mSecsSeriesDuration = props.seriesEndDate - props.seriesStartDate
  
  const scanDate = new Date(props.seriesStartDate)

  while (scanDate <= props.seriesEndDate) {
    newResult = await newMockScanResult(scanDate)
    await A11yScan.createFromAxeCoreResult(newResult, props.project_name, props.scan_name, props.revision, props.organisation)
    
    scanDate.setDate(scanDate.getDate() + props.scanFrequency)
  }
  return true
} 

const newMockScanResult = async (date) => {
  const _sr = props.finalScanResult,
  rulesSet = getAxeRulesForScan(date),
  mockRuleSpread = generateMockRulesSpread(rulesSet)

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

const generateMockRulesSpread = (rules) => {
  const nRules = rules.length,
  rando = getRandomInt(nRules)

  let mockRulesSpread = {
    violations: [],
    passes: []
  }

  rules.forEach((rule, index) => {
    if (rando % (index+1)) {
      mockRulesSpread.passes.push(rule)
    } else {
      mockRulesSpread.violations.push(rule)
    }
  })
  return mockRulesSpread
}

const getAxeRulesForScan = (scanDate) => {
  const allRules = props.axeRulesForSeries,
  nRules = allRules.length,
  mSecsFromStart = scanDate - props.seriesStartDate,
  cutOff = Math.round(mSecsFromStart / props.mSecsSeriesDuration * nRules)
  
  return allRules.slice(0, cutOff)
}

const getAxeRulesForSeries = () => {
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