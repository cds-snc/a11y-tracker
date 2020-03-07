const A11yScan = require('../../models/a11y-scan.js')
const vacScan = require('./data/vac_axe_results.json')

const insertSeedRecords = async (req, res) => {
  let project_name = "Veterans Affiars Canada : Find Benefits and Services",
  scan_name = "Results index page with Disability Benefit details expanded",
  revision = "f5d936ed375a374345612af9dc7e7450400a26a3"
  await A11yScan.insertAxeCoreResult(vacScan, project_name, scan_name, revision)
  res.send('Database seeded');
}

const deleteSeedRecords = async (req, res) => {
  await A11yScan.deleteMany({})
  res.send('Seed Documents removed from DB')
}

module.exports = (app) => {
  app.get('/mock-data/create', insertSeedRecords),
  app.get('/mock-data/delete', deleteSeedRecords)
}