const mongoose = require('mongoose')

const a11yScanSchema = mongoose.Schema({
  result: {}
})

const A11yScan = mongoose.model('A11yScan', a11yScanSchema)

module.exports = A11yScan