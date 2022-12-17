const testRouter = require('express').Router()
const Trip = require('../models/trip')
const Station = require('../models/station')


testRouter.post('/reset', async (request, response) => {
  await Trip.deleteMany({})
  await Station.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter