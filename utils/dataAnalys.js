const tripRouter = require('../controllers/trips')
const Trip = require('../models/trip')

const validateData = (data) => {
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
  const recordExist = Trip.findOne({rowData})
  if (recordExist) {
    console.log('invalid data --> Dublicate record');
    return { 'validation': false, 'reason': 'DublicateRecord', rowData }
  }
  return { 'validation': true, rowData }
}

module.exports = {
  validateData
}