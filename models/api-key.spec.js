const ApiKey = require('./api-key.js')

test('requires an organisation', async () => {
  const key = new ApiKey()
  key.validate(function(err) {
    expect(err.errors.organisation).toExist
  })
})

test('sets revoked to false', async () => {
  const key = new ApiKey({
    organisation: 'foo',
  })
  expect(key.revoked).toBe(false)
})

test('autogenerates a key with a prefix', async () => {
  const key = new ApiKey({
    organisation: 'foo',
  })
  expect(key.key).toContain("cds-snc:a11y-tracker:")
})
