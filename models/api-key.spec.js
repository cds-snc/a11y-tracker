const ApiKey = require('./api-key.js')

test('requires an organisation', async () => {
  const scan = new ApiKey()
  scan.validate(function(err) {
    expect(err.errors.organisation).toExist
  })
})

test('sets revoked to false', async () => {
  const scan = new ApiKey({
    organisation: 'foo',
  })
  expect(scan.revoked).toBe(false)
})

test('autogenerates a key with a prefix', async () => {
  const scan = new ApiKey({
    organisation: 'foo',
  })
  expect(scan.key).toContain("cds-snc:a11y-tracker:")
})
