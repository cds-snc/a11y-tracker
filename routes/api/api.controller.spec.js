const request = require('supertest')
const app = require('../../app.js')

test('Returns API key not valid is empty', async () => {
  const response = await request(app).post("/api/v1/scans")
  expect(response.statusCode).toBe(200)
})
