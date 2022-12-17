const Trip = require('../models/trip.js')
const Station = require('../models/station')

const validateData = async(data, dublicateCheck) => {

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

  if (dublicateCheck === 'false') {
    return { 'validation': true, rowData }
  }
  try {
    isDuble = await Trip.exists({
      departure: rowData.departure,
      return: rowData.return,
      departureStationId: rowData.departureStationId,
      returnStationId: rowData.returnStationId,
      distance: rowData.distance,
      duration: rowData.duration
    })
  
    if (isDuble) {
      return { 'validation': false, 'reason': 'Dublicate Record' }
    } else {
      return { 'validation': true, rowData }
    }
  } catch (e) {
    console.log(e.message);
  }
}

const statistic = async (stationId) => {
  try {
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

const stationDubCheck = async (data) => {
  const rowData = {
    fid: data[0],
    stationId: data[1],
    nameFinnish: data[2],
    nameSwedish: data[3],
    nameEnglish: data[4],
    addressFinnish: data[5],
    addrressEnglish: data[6],
    cityFinnish: data[7],
    citySwedish: data[8],
    opperator: data[9],
    capacity: data[10],
    location: {
      longtitude: data[11],
      latitude: data[12]
    }
  }
  const recordExist = await Station.exists({
                        stationId: rowData.stationId
                      })

  if (recordExist) {
    return { 'validation': false, 'reason': 'Dublicate Record'}
  }
  return { 'validation': true, rowData }
}

module.exports = {
  validateData,
  statistic,
  stationDubCheck
}