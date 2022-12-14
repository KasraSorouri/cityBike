const tripRouter = require('../controllers/trips')
const Trip = require('../models/trip')

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
module.exports = {
  validateData
}