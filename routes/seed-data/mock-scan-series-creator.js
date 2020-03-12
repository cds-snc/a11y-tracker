const A11yScan = require('../../models/a11y-scan.js')
const allAxeRules = require('./data/axe-rules.json')

let props = {
  finalScanResult: {}, // a real axe result representing the final scan in the mock series, from which the back dated mock results will be inferred
  project_name: "Mock Project",
  scan_name: "Mock Scan",
  revision: "Mock hash",
  organisation: "mockorg",
  seriesStartDate: new Date('2018-02-09T16:20:00'),
  seriesEndDate: new Date('2020-02-09T16:20:00'), 
  scanFrequency: 7, // number of days between scans
  axeRulesForSeries: allAxeRules,
  previousScanViolations: [],
}

const createMockScanSeries = async (config) => { 
  props.seriesEndDate = new Date()
  props = Object.assign(props, config)
  props.axeRulesForSeries =  getAxeRulesForSeries()
  props.mSecsSeriesDuration = props.seriesEndDate - props.seriesStartDate
  
  const scanDate = new Date(props.seriesStartDate)

  let newScanResult = {}

  while (scanDate <= props.seriesEndDate) {
    newScanResult = await newMockScanResult(scanDate)
    await A11yScan.createFromAxeCoreResult(newScanResult, props.project_name, props.scan_name, props.revision, props.organisation)

    props.previousScanViolations = [...newScanResult.violations]
    
    scanDate.setDate(scanDate.getDate() + props.scanFrequency)
  }
  return true
} 

const newMockScanResult = async (date) => {
  const _sr = props.finalScanResult
  const rulesSet = getAxeRulesForScan(date)
  const mockRuleSpread = generateMockRulesSpread(rulesSet)
  
  const mockResult = {
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
  const prevScanViolatedRules = props.previousScanViolations
  const prevScanViolatedRuleIds = prevScanViolatedRules.map(rule => rule.ruleId)
  const rulesSansPreviousViolations = rules.filter(rule => !prevScanViolatedRuleIds.includes(rule.ruleId)) 

  const mockRulesSpread = {
    violations: [],
    passes: [],
  }

  prevScanViolatedRules.forEach((rule) => {
    if (getRandomPercentage() < 85) { // assume that previous violations are corrected between scans at a probability of 85% 
      mockRulesSpread.passes.push(rule)
    } else {
      mockRulesSpread.violations.push(rule)
    }
  })

  rulesSansPreviousViolations.forEach((rule) => {
    if (getRandomPercentage() >= 15) { // assume that there is a 15% probability that each relevant a11y rule may be violated between scans 
      mockRulesSpread.passes.push(rule)
    } else {
      mockRulesSpread.violations.push(rule)
    }
  })
  return mockRulesSpread
}

const getAxeRulesForScan = (scanDate) => {
  const allRules = props.axeRulesForSeries
  const nRules = allRules.length
  const mSecsFromStart = scanDate - props.seriesStartDate
  const cutOff = Math.round(mSecsFromStart / props.mSecsSeriesDuration * nRules)
  
  return allRules.slice(0, cutOff)
}

const getAxeRulesForSeries = () => {  
  const finalScanRules = [...props.finalScanResult.violations, ...props.finalScanResult.passes]
  const relevantAxeRuleIds = finalScanRules.map(rule => rule.id)
  const rules =  allAxeRules.filter(rule => relevantAxeRuleIds.includes(rule.ruleId))
  
  return rules
}

const getRandomPercentage = (max = 100) => {
  return Math.floor(Math.random() * Math.floor(max))
}

module.exports = createMockScanSeries