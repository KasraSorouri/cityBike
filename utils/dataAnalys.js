const Trip = require('../models/trip.js')
const Station = require('../models/station')

const statistic = async (sid, searchParameter) => {
  const stationId = sid
  try {
    const station = await Station.findOne({ stationId: stationId })
    const totalTripFrom = await Trip.find({ $and: [{ departureStationId: stationId }, { ...searchParameter }] }).count()
    const totalTripTo = await Trip.find({ $and: [{ returnStationId: stationId }, { ...searchParameter }] }).count()
    const avrageTripFrom = await Trip.aggregate([
      { $match: { $and: [{ departureStationId: stationId }, { ...searchParameter }] } },
      { $group: {
        _id: null,
        distance: { $avg: '$distance' }
      }
      }
    ])
    const avrageTripTo = await Trip.aggregate([
      { $match:  { $and: [{ returnStationId: stationId }, { ...searchParameter }] } },
      { $group: {
        _id: null,
        distance: { $avg: '$distance' }
      }
      }
    ])

    const roundTrip = await Trip.aggregate([
      { $match: { $and: [{ departureStationId: stationId , returnStationId: stationId }, { ...searchParameter }] } },
      { $group: {
        _id: null,
        count: { $sum: 1 },
        duration: { $avg: '$duration' },
        minDuration: { $min: '$duration' },
        maxDuration: { $max: '$duration' },
        distance: { $avg: '$distance' },
        minDistance: { $min: '$distance' },
        maxDistance: { $max: '$distance' },
      }
      }
    ])

    const departureFrom = await Trip.aggregate([
      { $match: { $and: [{ departureStationId: stationId }, { ...searchParameter }] } },
      { $group: {
        _id: '$returnStationName',
        count: { $sum: 1 },
        duration: { $avg: '$duration' },
        minDuration: { $min: '$duration' },
        maxDuration: { $max: '$duration' },
        distance: { $avg: '$distance' },
        minDistance: { $min: '$distance' },
        maxDistance: { $max: '$distance' },
      }
      },
      { $sort: { count: -1 } }
    ]).limit(5)

    const destinationTo = await Trip.aggregate([
      { $match: { $and: [{ returnStationId: stationId }, { ...searchParameter }] } },
      { $group: {
        _id: '$departureStationName',
        count: { $sum: 1 },
        duration: { $avg: '$duration' },
        minDuration: { $min: '$duration' },
        maxDuration: { $max: '$duration' },
        distance: { $avg: '$distance' },
        minDistance: { $min: '$distance' },
        maxDistance: { $max: '$distance' },
      }
      },
      { $sort: { count: -1 } }
    ]).limit(5)

    const body = {
      'totalTripFromStation': totalTripFrom,
      'totalTripToStation': totalTripTo,
      'avrageTripFromStation': avrageTripFrom[0] ? avrageTripFrom[0].distance : null ,
      'avrageTripToStation': avrageTripTo[0] ? avrageTripTo[0].distance : null,
      'returnTrip': roundTrip,
      'departureFrom': departureFrom,
      'destinationTo': destinationTo
    }

    if (!station) {
      console.log('can not find the station!' )
      return null
    }
    return body
  } catch (e) {
    console.log('error ->',e.message)
    return e.message
  }
}

const filterParameter = async() => {
  const parameter = await Trip.aggregate([
    { $match: {} },
    { $group: {
      _id: null,
      earliest: { $min: '$departure' },
      latest: { $max: '$return' }
    }
    }
  ])
  return parameter[0]
}

module.exports = {
  statistic,
  filterParameter
}