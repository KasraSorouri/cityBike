const {parse} = require('csv-parse')
const fs = require('fs')
const dataAnalys = require('../utils/dataAnalys')
const Trip = require('../models/trip')

 
const processFile = async (file) => { 
  var inValidData = []
   return new Promise(async(resolve, reject) => {
    const path = file;
    const stream = fs.createReadStream(path);
    const parser = parse({ delimiter: ',', from_line: 2, to_line: 20 });

    stream.on('ready', async() => {
      stream.pipe(parser);
    });

    parser.on('readable', async() => {
      let record;
      while (record = parser.read()) {
        const analysedData = await dataAnalys.validateData(record)
        if (analysedData.validation) {
          const validData = new Trip(analysedData.rowData)
          await validData.save()
        }
        if (!analysedData.validation) {
          inValidData = inValidData.concat(analysedData)
        }
      }
    });

    parser.on('error', function(err){
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

 module.exports = processFile