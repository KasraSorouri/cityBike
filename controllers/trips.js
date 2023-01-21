const tripRouter = require('express').Router()
const Trip = require('../models/trip.js')
const dataAnalys = require('../utils/dataAnalys')

tripRouter.get('/:page/:rowsPerPage',  async (request, response) => {
  const filter = request.query
  const sortParameter = request.body.sort
  const page = request.params.page
  const rows = request.params.rowsPerPage
  let searchParameter = {}

  filter.originStation !== 'null' ? searchParameter.departureStationId =`${filter.originStation}` : null
  filter.destinationStation !== 'null' ? searchParameter.returnStationId=`${filter.destinationStation}` : null
  filter.start !== 'null' ? searchParameter.departure= { $gte: filter.start } : null
  filter.end !== 'null' ? searchParameter.return= { $lte: filter.end } : null
  filter.durationFrom !== 'null' && filter.durationTo === 'null' ? searchParameter.duration={ $gte: filter.durationFrom*60 } : null
  filter.durationFrom === 'null' && filter.durationTo !== 'null' ? searchParameter.duration={ $lte: filter.durationTo*60 } : null
  filter.durationFrom !== 'null' && filter.durationTo !== 'null' ? searchParameter.duration={ $gte: filter.durationFrom*60 , $lte: filter.durationTo*60} : null

  filter.distanceFrom !== 'null' && filter.distanceTo === 'null' ? searchParameter.distance={ $gte: filter.distanceFrom*1000 } : null
  filter.distanceFrom === 'null' && filter.distanceTo !== 'null' ? searchParameter.distance={ $lte: filter.distanceTo*1000 } : null
  filter.distanceFrom !== 'null' && filter.distanceTo !== 'null' ? searchParameter.distance={ $gte: filter.distanceFrom*1000 , $lte: filter.distanceTo*1000} : null

  console.log((filter.durationFrom !== 'undefined') && (filter.durationTo !== 'undefined'))
  console.log('pagination * page ->', request.params.page, '   rows ->', rows)
  console.log('Search query ->', request.query)
  console.log('Search Items ->', filter)
  console.log('Search params ->',searchParameter)
  console.log('Sort params ->', sortParameter)
 
  try {
    const totalTrips = await Trip.find({...searchParameter}).countDocuments()
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