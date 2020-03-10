const A11yScan = require('../../models/a11y-scan.js')
const createMockScanSeries = require('./mock-scan-series-creator.js')
const vacScan = require('./data/vac-axe-results.json')

const org = "mockcdssnc"

const deleteAllMockScanDocuments = async (req, res) => {
  await A11yScan.deleteMany({organisation: org})
  res.send('Seed Documents removed from DB')
}

const seedMockScanSeries = async (req, res) => {
  let config = {
    finalScan: vacScan,
    project_name: "VAC : Find Benefits and Services",
    scan_name: "Results index page with Disability Benefit details expanded",
    revision: "f5d936ed375a374345612af9dc7e7450400a26a3",
    organisation: org,
    scanSeriesStartDate: new Date('2018-02-09T16:20:00'), 
    scanFrequency: 7 // number of days between scans,
  }
  createMockScanSeries(config)
  res.send("Mock scan series created")
}

module.exports = (app) => {
  app.get('/mock-data/mock-scan-series', seedMockScanSeries)
  app.get('/mock-data/delete', deleteAllMockScanDocuments)
}