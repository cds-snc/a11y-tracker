const mongoose = require('mongoose')

const connectURL = process.env.MONGODB_URI || process.env.MONGO_URL ||'mongodb://localhost/a11y-scans'

mongoose.connect(connectURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection

db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})

db.once('open', () => console.log('MongoDB connection established'))

module.exports = db