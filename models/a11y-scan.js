const mongoose = require('mongoose')

const a11yScanSchema = mongoose.Schema({
  result: {}
})

const A11yScan = mongoose.model('A11yScan', a11yScanSchema)

var sampleScanResult = require('./scan_result_samples/vac.json')

new A11yScan({
  result: sampleScanResult
}).save()

module.exports = A11yScan