const {parse} = require('csv-parse')
const fs = require('fs')
const dataAnalys = require('../utils/dataAnalys')
const Trip = require('../models/trip.js')
const Station = require('../models/station')

 
const processTrip = async(file,dublicateCheck) => { 
  console.log('path ->', file ,dublicateCheck);
  return new Promise((resolve, reject) => {
    var inValidData = []
    const stream = fs.createReadStream(file)
    const parser = parse({ delimiter: ',', from_line: 57000, to_line: 60000 })
    
    stream.on('ready', async () => {
      stream.pipe(parser)
    })

    parser.on('readable', async () => {
      let record
      while (record = parser.read()) {
        const analysedData = await dataAnalys.validateData(record, dublicateCheck)
        if (analysedData.validation) {
          const validData = new Trip(analysedData.rowData)
          await validData.save()
        }
        if (!analysedData.validation) {
          inValidData = inValidData.concat(analysedData.reason)
        }
      }
    })

    parser.on('error', async (err) => {
      console.error(err.message)
      reject()
    })

    parser.on('end', () => {
      const unSuccess = inValidData.map(data => data.reason)
      console.log('Parsing complete')
      const proccessResult = { 'Invalid records': unSuccess.length, 'invalid reasons ->': inValidData }
      resolve(proccessResult)
      return proccessResult
    })
  })
}

const processStation = async (file) => { 
   console.log('process station -> ',file);
  return new Promise((resolve, reject) => {
    var inValidData = []
    //const path = file;
    const stream = fs.createReadStream(file);
    const parser = parse({ delimiter: '\t', from_line: 2 });

    stream.on('ready', async() => {
      stream.pipe(parser);
    });

    parser.on('readable', async() => {
      let record;
      while (record = parser.read()) {
        const analysedData = await dataAnalys.stationDubCheck(record)
        console.log('validate data', analysedData);
        if (analysedData.validation) {
          const validData = new Station(analysedData.rowData)
          await validData.save()
        }
        if (!analysedData.validation) {
          inValidData = inValidData.concat(analysedData)
        }
      }
    });

    parser.on('error', async(err) => {
      console.error(err.message);
      reject();
    });

    parser.on('end', async() => {
      console.log('Parsing complete');
      const unSuccess = inValidData.map(data => data.reason)
      const proccessResult = { 'Invalid records': unSuccess.length, 'invalid reasons ->': unSuccess }
      resolve(proccessResult)
      return proccessResult
    });
  });
 }
module.exports = {
  processTrip,
  processStation
 }