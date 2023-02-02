const tripRouter = require('express').Router()
const Trip = require('../models/trip.js')

tripRouter.get('/:page/:rowsPerPage',  async (request, response) => {
  const filter = request.query
  const page = request.params.page
  const rows = request.params.rowsPerPage
  let searchParameter = {}
  let sortParameter= {}

  if ( Object.keys(filter).length > 0 ) {
    filter.originStation !== 'null' ? searchParameter.departureStationId =`${filter.originStation}` : null
    filter.destinationStation !== 'null' ? searchParameter.returnStationId=`${filter.destinationStation}` : null
    filter.start !== 'null' ? searchParameter.departure= { $gte: filter.start } : null
    filter.end !== 'null' ? searchParameter.return= { $lte: filter.end } : null
    filter.durationFrom !== 'null' && filter.durationTo === 'null' ? searchParameter.duration={ $gte: filter.durationFrom*60 } : null
    filter.durationFrom === 'null' && filter.durationTo !== 'null' ? searchParameter.duration={ $lte: filter.durationTo*60 +59 } : null
    filter.durationFrom !== 'null' && filter.durationTo !== 'null' ? searchParameter.duration={ $gte: filter.durationFrom*60 , $lte: filter.durationTo*60+59 } : null

    filter.distanceFrom !== 'null' && filter.distanceTo === 'null' ? searchParameter.distance={ $gte: filter.distanceFrom*1000 } : null
    filter.distanceFrom === 'null' && filter.distanceTo !== 'null' ? searchParameter.distance={ $lte: filter.distanceTo*1000 } : null
    filter.distanceFrom !== 'null' && filter.distanceTo !== 'null' ? searchParameter.distance={ $gte: filter.distanceFrom*1000 , $lte: filter.distanceTo*1000 } : null
  }

  sortParameter[request.query.orderBy] = request.query.order === 'desc' ? -1 : 1

  try {
    const totalTrips = await Trip.find({ ...searchParameter }).countDocuments()
    const trips = await Trip.find({ ...searchParameter }).sort(sortParameter).skip(page*rows).limit(rows)
    const body = { trips, totalTrips }
    response.json(body)
  } catch (e) {
    console.log(e.message)
  }
})

module.exports = tripRouter