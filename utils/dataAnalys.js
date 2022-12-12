const validateData = (data) => {
  let rowDara = {
    departure: data[0],
    return: data[1],
    departureStationId: data[2],
    departureStationName: data[3],
    returnStationId: data[4],
    returnStationName: data[5],
    distance: data[6],  
    duration: data[7],
  }
  if (rowDara.distance < 10) {
    console.log('invalid data --> short trip')
    return false
  }
  if (rowDara.duration < 10) {
    console.log('invalid data --> quick trop')
    return false
  }
  return rowDara
}

module.exports = {
  validateData
}