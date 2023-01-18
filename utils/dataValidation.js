const Trip = require('../models/trip.js')
const Station = require('../models/station')

const validateTripData = async(data, dublicateCheck) => {
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
    return { 'validation': false, 'reason': 'short trip', rowData }
  }
  if (rowData.duration < 10) {
    return { 'validation': false, 'reason': 'quick trip', rowData }
  }

  if (dublicateCheck === 'false' ) {
    return { 'validation': true, rowData }
  }
  try {
    const isDuble = await Trip.exists({
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

const validateStationData = async (data, dublicateCheck) => {
  console.log('validate station data ->', data )
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
  if (dublicateCheck === 'false' ) {
    return { 'validation': true, rowData }
  }
  try {
  const isDuble = await Station.exists({
                        stationId: rowData.stationId
                      })
  if (isDuble) {
    return { 'validation': false, 'reason': 'Dublicate Record'}
  }
  return { 'validation': true, rowData }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = {
  validateTripData,
  validateStationData
}