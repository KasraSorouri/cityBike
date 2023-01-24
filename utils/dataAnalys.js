const Trip = require('../models/trip.js')
const Station = require('../models/station')

const statistic = async (sid) => {
  const stationId = sid
  console.log('bakend staion Id ->', stationId)
  try {
    const station = await Station.findOne({stationId: stationId })
    const totalTripFrom = await Trip.find({ departureStationId: stationId }).count()
    const totalTripTo = await Trip.find({ returnStationId: stationId }).count()
    const avrageTripFrom = await Trip.aggregate([
      { $match: { departureStationId: stationId } },
      { $group: {
          _id: null,
          distance: {$avg: "$distance"} 
        }
      }
    ])
    const avrageTripTo = await Trip.aggregate([
      { $match: { returnStationId: stationId } },
      { $group: {
          _id: null,
          distance: { $avg: "$distance" }
        }
      }
    ])

    const roundTrip = await Trip.aggregate([
      { $match: { departureStationId: stationId , returnStationId: stationId }},
      { $group: {
          _id: "$returnStationName",
          count: { $sum: 1 },
          duration: { $avg: "$duration" },
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          distance: { $avg: "$distance" },
          minDistance: { $min: "$distance" },
          maxDistance: { $max: "$distance" },
        }
      },
      { $sort: { count: -1 } }
    ]).limit(5)

    const departureFrom = await Trip.aggregate([
      { $match: { departureStationId: stationId }},
      { $group: {
          _id: "$returnStationName",
          count: { $sum: 1 },
          duration: { $avg: "$duration" },
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          distance: { $avg: "$distance" },
          minDistance: { $min: "$distance" },
          maxDistance: { $max: "$distance" },
        }
      },
      { $sort: { count: -1 } }
    ]).limit(5)

    const destinationTo = await Trip.aggregate([
      { $match: { returnStationId: stationId }},
      { $group: {
          _id: "$departureStationName",
          count: { $sum: 1 },
          duration: { $avg: "$duration" },
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          distance: { $avg: "$distance" },
          minDistance: { $min: "$distance" },
          maxDistance: { $max: "$distance" },
        }
      },
      { $sort: { count: -1 } }
    ]).limit(5)
  
    const body = {
      'stationInfo':station,
      'totalTripFromStation': totalTripFrom,
      'totalTripToStation': totalTripTo,
      'avrageTripFromStation': avrageTripFrom,
      'avrageTripToStation': avrageTripTo,
      'returnTrip': roundTrip,
      'departureFrom': departureFrom,
      'destinationTo': destinationTo
    }
    console.log('stattion ->',station)

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
    { $match: {}},
    { $group: {
          _id: null,
          earliest: { $min: "$departure" },
          latest: { $max: "$return" }
      }
    }
  ])
  return parameter[0]
}


module.exports = {
  statistic,
  filterParameter
}