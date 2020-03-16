const A11yScan = require('../../models/a11y-scan.js')
const createMockScanSeries = require('./mock-scan-series-creator.js')
const vacScans = require('./data/vac-axe-results.json')

const org = "mockorg"

const deleteAllMockScanDocuments = async (req, res) => {
  await A11yScan.deleteMany({organisation: org})
  res.send('Seed Documents removed from DB')
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

module.exports = (app) => {
  app.get('/seed-data/create', seedMockScanSeries)
  app.get('/seed-data/delete', deleteAllMockScanDocuments)
}