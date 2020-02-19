const mongoose = require('mongoose')

const a11yScanSchema = mongoose.Schema({
  result: {}
})

const A11yScan = mongoose.model('A11yScan', a11yScanSchema)

module.exports = A11yScan

A11yScan.find({}, (err, scans) => {
  scans.forEach((scan) => {
    console.log('scan result...')
    console.log(scan.result);
  })
});