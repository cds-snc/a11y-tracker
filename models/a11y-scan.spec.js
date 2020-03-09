const A11yScan = require('./a11y-scan.js')
const db = require('../db.js')

test('requires a url', async () => {
  const scan = new A11yScan()
  scan.validate(function(err) {
    expect(err.errors.url).toExist
  })
})

test('requires a project_name', async () => {
  const scan = new A11yScan()
  scan.validate(function(err) {
    expect(err.errors.project_name).toExist
  })
})

test('requires a organisation', async () => {
  const scan = new A11yScan()
  scan.validate(function(err) {
    expect(err.errors.organisation).toExist
  })
})

test('should be valid if url, project_name, and organisation exist', async () => {
  const scan = new A11yScan({
		url: "foo",
		project_name: "bar",
		organisation: "baz"
	})
  scan.validate(function(err) {
    expect(err).toBe(null)
  })
})

afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  db.close()
  done()
})
