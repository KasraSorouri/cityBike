const csvFileParser = require('../utils/csvFileParser')
const dataValidation = require('../utils/dataValidation')
const Trip = require('../models/trip.js')
const Station = require('../models/station')

const processTrip = async (file,dublicateCheck) => {
  const records = await csvFileParser.processTripFile(file)
  const inValidRecords = []
  for(const record of records) {
    const analysedData = await dataValidation.validateTripData(record,dublicateCheck)
    if (analysedData.validation) {
      const trip = new Trip (analysedData.rowData)
      await trip.save()
    }
    if (!analysedData.validation) {
      inValidRecords.push(analysedData.reason)
    }
  }
  const response = {
    'totalRecords': records.length,
    'inValidRecords' : inValidRecords.length,
    'addRecordeToDatabse': records.length - inValidRecords.length,
    'shortTrip': inValidRecords.filter(record => record == 'short trip').length,
    'quickTrip': inValidRecords.filter(record => record == 'quick trip').length,
    'dublicatedRecord': inValidRecords.filter(record => record == 'Dublicate Record').length
  }
  return response
}

const processStation = async (file,dublicateCheck) => { 
  const records = await csvFileParser.processStationFile(file)
  const inValidRecords = []
  for(const record of records) {
    const analysedData = await dataValidation.validateStationData(record,dublicateCheck)
    if (analysedData.validation) {
      const station = new Station(analysedData.rowData)
      await station.save()
    }
    if (!analysedData.validation) {
      inValidRecords.push(analysedData.reason)
    }
  }

  const response = {
    'totalRecords': records.length,
    'inValidRecords' : inValidRecords.length,
    'addRecordeToDatabse': records.length - inValidRecords.length,
    'dublicatedRecord': inValidRecords.filter(record => record == 'Dublicate Record').length
  }
  return response
}

module.exports = {
  processTrip,
  processStation
}