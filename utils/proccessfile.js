const csvFileParser = require('../utils/csvFileParser')
const dataAnalys = require('../utils/dataAnalys')
const Trip = require('../models/trip.js')
const Station = require('../models/station')

const processTrip = async (file,dublicateCheck) => {
  const records = await csvFileParser.processTripFile(file)
  const inValidRecords = []
  for(const record of records) {
    const analysedData = await dataAnalys.validateData(record,dublicateCheck)
    if (analysedData.validation) {
      const trip = new Trip (analysedData.rowData)
      await trip.save()
    }
    if (!analysedData.validation) {
      inValidRecords.push(analysedData.reason)
    }
  }
  return inValidRecords
}

const processStation = async (file,dublicateCheck) => { 
  const records = await csvFileParser.processStationFile(file)
  const inValidRecords = []
  for(const record of records) {
    const analysedData = await dataAnalys.stationDubCheck(record,dublicateCheck)
    if (analysedData.validation) {
      const station = new Station(analysedData.rowData)
      await station.save()
    }
    if (!analysedData.validation) {
      inValidRecords.push(analysedData.reason)
    }
  }
  return inValidRecords
}

module.exports = {
  processTrip,
  processStation
}