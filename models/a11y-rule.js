const mongoose = require('mongoose')
const Schema = mongoose.Schema

const a11yRule = new Schema({
  ruleId: {type: String, required: true},
  description: {type: String, required: true},
  help: {type: String, required: true},
  helpUrl: {type: String, required: true},
  tags: [String],
  weight: Number,
}, {
  timestamps: true
})

module.exports = mongoose.model('A11yRule', a11yRule)