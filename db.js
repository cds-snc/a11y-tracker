const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/a11y-scans', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log('MongoDB connection established'))

const A11yScan = require('./models/a11y-scan.js')

A11yScan.find({}, (err, scans) => {
  scans.forEach((scan) => {
    console.log('scan result...')
    console.log(scan.result);
  })
});

A11yScan.deleteMany({}, (err, result) => {
  if(err) {
    console.log(err)
  }
  console.log(result)
})

