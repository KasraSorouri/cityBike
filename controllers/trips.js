const tripRouter = require('express').Router()
const Trip = require('../models/trip.js')
const dataAnalys = require('../utils/dataAnalys')

tripRouter.get('/:page/:rowsPerPage',  async (request, response) => {
  const searchParameter = request.body.searchParameter
  const sortParameter = request.body.sort
  const page = request.params.page
  const rows = request.params.rowsPerPage
  console.log('pagination * page ->', request.params.page, '   rows ->', rows)
  console.log('Search params ->', searchParameter)
  console.log('Sort params ->', sortParameter)

  try {
    const totalTrips = await Trip.countDocuments()
    const trips = await Trip.find({...searchParameter}).sort({ ...sortParameter }).skip(page*rows).limit(rows)
    const body = { trips, totalTrips }
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