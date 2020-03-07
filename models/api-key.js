const mongoose = require('mongoose')
const Schema = mongoose.Schema

const apiKeySchema = new Schema({
  key: String, // The API key
  project_name: String, // short description of the project/app the URL belongs to (e.g. "CPPD Disability Benefit" )
  revoked: Boolean, // if the key is revoked
}, {
  timestamps: true
})

const ApiKey = mongoose.model('ApiKey', apiKeySchema)

module.exports = ApiKey