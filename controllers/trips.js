const tripRouter = require('express').Router()
const Trip = require('../models/trip.js')
const dataAnalys = require('../utils/dataAnalys')

tripRouter.get('/',  async (request, response) => {
  const searchParameter = request.body.searchParameter
  const sortParameter = request.body.sort
  console.log('Search params ->', searchParameter);
  console.log('Sort params ->', sortParameter);

  try {
    const body = await Trip.find({...searchParameter}).sort({ ...sortParameter }).limit(500)
    response.json(body)
  } catch (e) {
    console.log(e.message);
  }
})

tripRouter.get('/:sid', async (request, response) => {

  const stationId = request.params.sid
//  console.log('Search params ->', stationId);
  const body  =  await dataAnalys.statistic(stationId)
  response.status(200).json(body)
})

module.exports = tripRouter