const Trip = require('../models/trip.js')

const validateData = async(data) => {
  let rowData = {
    departure: data[0],
    return: data[1],
    departureStationId: data[2],
    departureStationName: data[3],
    returnStationId: data[4],
    returnStationName: data[5],
    distance: data[6],  
    duration: data[7],
  }
  if (rowData.distance < 10) {
    console.log('invalid data --> short trip')
    return { 'validation': false, 'reason': 'short trip', rowData }
  }
  if (rowData.duration < 10) {
    console.log('invalid data --> quick trip')
    return { 'validation': false, 'reason': 'quick trip', rowData }
  }
  if (true) {
    const result = await dubCheck(rowData)
    if (result === true) {
      return { 'validation': false, 'reason': 'Dublicate Record'}
    }
    return { 'validation': true, rowData }
  }

}

const dubCheck = async(data) => {
  const recordExist = await Trip.findOne({
                        departure: data.departure,
                        return: data.return,
                        departureStationId: data.departureStationId,
                        returnStationId: data.returnStationId,
                        distance: data.distance,  
                        duration: data.duration
                      })

  if (recordExist) {
    return true
  }
  return false
}

const statistic = async(stationId) => {
  try {
    const totalTripFrom = await Trip.find({ departureStationId: stationId }).count()
    const totalTripTo = await Trip.find({ returnStationId: stationId }).count()
    const avrageTripFrom = await Trip.aggregate([
      { $match: { departureStationId: stationId } },
      {
        $group: {
          _id: null,
          distance: {$avg: "$distance"} 
        }
      }
    ])
    const avrageTripTo = await Trip.aggregate([
      { $match: { returnStationId: stationId } },
      {
        $group: {
          _id: null,
          distance: { $avg: "$distance" }
        }
      }
    ])

    const roundTrip = await Trip.aggregate([
      { $match: { departureStationId: stationId , returnStationId: stationId} },
      {
        $group: {
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
      { $match: { departureStationId: stationId } },
      {
        $group: {
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
      { $match: { retrunStationId: stationId } },
      {
        $group: {
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
      'total trip from station': totalTripFrom,
      'total trip to station': totalTripTo,
      'avrage trip from station': avrageTripFrom,
      'avrage trip to station': avrageTripTo,
      'return Trip <> ': roundTrip,
      'departureFrom -> ': departureFrom,
      'destinationTo <- ': destinationTo
    }

    return body
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = {
  validateData,
  statistic
}