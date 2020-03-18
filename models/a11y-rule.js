const mongoose = require('mongoose')
const Schema = mongoose.Schema

const a11yRuleSchema = new Schema({
  ruleId: {type: String, required: true},
  description: {type: String, required: true},
  help: {type: String, required: true},
  helpUrl: {type: String, required: true},
  tags: [String],
  weight: Number,
}, {
  timestamps: true
})

a11yRuleSchema.statics.sumAllWeights = function() {
  return this.aggregate().
    group({ _id: null, total: { $sum: "$weight"  }}).
    then(result => result[0].total)
}  

module.exports = mongoose.model('A11yRule', a11yRuleSchema)