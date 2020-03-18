const A11yScan = require('../../models/a11y-scan.js')
const createMockScanSeries = require('./mock-scan-series-creator.js')
const vacScans = require('./data/vac-axe-results.json')

const A11yRule = require('../../models/a11y-rule.js')
const axeRules = require('./data/axe-rules.json')

const org = "mockorg"

const deleteMockScans = async (req, res) => {
  await A11yScan.deleteMany({organisation: org})
  res.send('All documents representing Mock Scans have been removed from the database')
}

const seedMockScanSeries = async (req, res) => {
  const config = {
    projectName: "VAC : Find Benefits and Services",
    organisation: org,
    scanSeriesStartDate: new Date('2018-02-09T16:20:00'), 
  }

  for (const scan of vacScans) {
    config.finalScanResult = scan.axeResultObj
    config.scanName = scan.scanName
    await createMockScanSeries(config)
  }
  res.send("Mock scan series created")
}

const seedAxeRules = async (req, res) => {
  await A11yRule.create(axeRules, function(err, rules) {
    if (err) {
      res.send(err)
    } else {
      res.send(`${rules.length} aXe a11y rules have been added to the database`)
    }
  })
}

const deleteAxeRules = async (req, res) => {
  await A11yRule.deleteMany({}, function(err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send("All document(s) representing a11y rules have been removed from the database")
    }
  })
}

module.exports = (app) => {
  app.get('/seed-data/create-mock-scan-series', seedMockScanSeries)
  app.get('/seed-data/delete-mock-scans', deleteMockScans)
  app.get('/seed-data/insert-axe-rules', seedAxeRules)
  app.get('/seed-data/delete-axe-rules', deleteAxeRules)
}