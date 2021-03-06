const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuid = require("uuidv4");

const generateApiKey = () => {
  return `cds-snc:a11y-tracker:${uuid.uuid()}`
}

const apiKeySchema = new Schema({
  key: {type:String, default: generateApiKey}, // The API key
  organisation: {type:String, required: true}, // Name of the organisation that owns the key
  revoked: {type:Boolean, default: false}, // if the key is revoked
}, {
  timestamps: true
})

apiKeySchema.index({ key: 1 });

const ApiKey = mongoose.model('ApiKey', apiKeySchema)

module.exports = ApiKey