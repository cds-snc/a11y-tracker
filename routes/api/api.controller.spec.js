const request = require('supertest')
const app = require('../../app.js')
const db = require('../../db.js')
const {SHA256} = require("sha2");
const ApiKey = require('./../../models/api-key.js')

test('Returns API key not valid is empty', async () => {
  const response = await request(app).post('/api/v1/scans')
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe("API key not valid")
})

test('Returns API key is revoked if revoked', async () => {
  const key = new ApiKey({
    organisation: 'foo',
    revoked: true,
  })
  const clear = key.key
  key.key = SHA256(`${clear}.${process.env.SALT}`).toString("base64")
  await key.save()

  const response = await request(app).post('/api/v1/scans').send({
    key: clear,
  })
  expect(response.statusCode).toBe(401)
  expect(response.body.message).toBe("API key is revoked")
})

test('Failed to save! Check schema! is something is missing', async () => {
  const key = new ApiKey({
    organisation: 'bar',
  })
  const clear = key.key
  key.key = SHA256(`${clear}.${process.env.SALT}`).toString("base64")
  await key.save()

  const response = await request(app).post('/api/v1/scans').send({
    key: clear,
  })
  expect(response.statusCode).toBe(500)
  expect(response.body.message).toBe("Failed to save! Check schema!")
})

test('Success is something is there', async () => {
  const key = new ApiKey({
    organisation: 'bar',
  })
  const clear = key.key
  key.key = SHA256(`${clear}.${process.env.SALT}`).toString("base64")
  await key.save()

  const response = await request(app).post('/api/v1/scans').send({
    project_name: "bar",
    key: clear,
    result: {
      url: "foo",
    },
  })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe("Success")
})

afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  db.close()
  done()
})
