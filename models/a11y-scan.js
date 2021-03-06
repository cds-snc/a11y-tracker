const mongoose = require('mongoose')
const Schema = mongoose.Schema

const A11yRule = require('./a11y-rule.js')

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
  a11yScore: Number,  
}, {
  timestamps: true
})

a11yScanSchema.index({ project_name: 1, scan_name: 1 });

a11yScanSchema.statics.createFromAxeCoreResult = async function(axeResultObj, projectName, scanName, revision, organisation) {
  const _newModel = new this({
    url: axeResultObj.url,
    testEnvironment: axeResultObj.testEnvironment,
    timeStamp: axeResultObj.timestamp,
    violations: axeResultObj.violations,
    passes: axeResultObj.passes,
    incomplete: axeResultObj.incomplete,
    inapplicable: axeResultObj.inapplicable,
    axe_meta_data: {
      testEngine: axeResultObj.testEngine,
      testRunner: axeResultObj.testRunner,
      toolOptions: axeResultObj.toolOptions,
    },
    project_name: projectName,
    scan_name: scanName,
    revision: revision,
    organisation: organisation,
  })

  await _newModel.save()  
}

a11yScanSchema.pre('save', function() {
  this.a11yScore = this.score
});

a11yScanSchema.post('save', scan => {
  console.log('A scan with an A11y score of %s has been saved', scan.score);
});

a11yScanSchema.virtual("totalViolationWeights").get(function() {
  let totalViolationWeights = 0
  this.violations.forEach(violation => {
    totalViolationWeights += Number(violation.weight)
  }) 
  return totalViolationWeights
})

a11yScanSchema.virtual("score").get(function() {
  const violdatedRulesWeight = this.totalViolationWeights
  const allRulesWeight = A11yRule.getTotalWeights()
  const percentOfRulesViolated = violdatedRulesWeight / allRulesWeight * 100
  const score = 100 - Math.floor(percentOfRulesViolated)
  return score
})

module.exports = mongoose.model('A11yScan', a11yScanSchema)