const A11yScan = require('../../models/a11y-scan.js')
const vacScan = require('./data/vac-axe-results.json')

const mockProjectName = "Mock Data : Find Benefits and Services"

const insertSeedRecords = async (req, res) => {
  const scanName = "Results index page with Disability Benefit details expanded"
  const revision = "f5d936ed375a374345612af9dc7e7450400a26a3"
  await A11yScan.insertAxeCoreResult(vacScan, mockProjectName, scanName, revision, "cdssnc")
  res.send('Database seeded');
}

const deleteSeedRecords = async (req, res) => {
  await A11yScan.deleteMany({project_name: mockProjectName})
  res.send('Seed Documents removed from DB')
}

module.exports = (app) => {
  app.get('/mock-data/create', insertSeedRecords)
  app.get('/mock-data/delete', deleteSeedRecords)
}