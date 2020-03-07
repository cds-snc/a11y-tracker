const mongoose = require('mongoose')
const Schema = mongoose.Schema

const a11yScanSchema = new Schema({
  url: {type: String, required: true}, // the URL that was scanned
  testEnvironment: {}, // state of the client/browser during the scan
  timeStamp: Date,
  violations: [],
  passes: [],
  incomplete: [],
  inapplicable: [],
  axe_meta_data: {}, // meta-data fields that do not mirror axe-core result object fields 
  scan_name: String, // short description of the state of the webpage/DOM while the scan was run (e.g. "Invalid login state")
  project_name: {type: String, required: true}, // short description of the project/app the URL belongs to (e.g. "CPPD Disability Benefit" )
  revision: String, // the version of the project/app that was scanned (e.g. Git hash or version tag)
  organisation: {type: String, required: true},
}, {
  timestamps: true
})

const A11yScan = mongoose.model('A11yScan', a11yScanSchema)

module.exports = A11yScan