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
 
a11yRuleSchema.statics.getTotalWeights = function() {
  return totalWeights
} 

a11yRuleSchema.post('save', function(rule) {
  sumAllWeights()
  console.log('%s has been saved', rule.ruleId);
});

a11yRuleSchema.post('remove', function(rule) {
  sumAllWeights()
  console.log('%s has been removed', rule.ruleId);
});

const A11yRule = mongoose.model('A11yRule', a11yRuleSchema)
let totalWeights

const sumAllWeights = function() {
  A11yRule.aggregate().group({ _id: null, total: { $sum: "$weight"  }}).
    then(result => {
      totalWeights = (result[0] === undefined ? 0 : result[0].total)
    })
}

sumAllWeights()
module.exports = A11yRule 
