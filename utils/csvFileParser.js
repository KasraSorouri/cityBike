const {parse} = require('csv-parse')
const fs = require('fs')

const processTripFile = async (file) => {
  const records = []
  const parser = fs
    .createReadStream(file)
    .pipe(parse({ delimiter: ',', from_line: 2 }))
  for await(const record of parser) {
    records.push(record)
  }
  return records
}

const processStationFile = async (file) => {
  const records = []
  const parser = fs
    .createReadStream(file)
    .pipe(parse({ delimiter: '\t', from_line: 2 }))
  for await(const record of parser) {
    records.push(record)
  }
  return records
} 

module.exports = {
  processTripFile,
  processStationFile
}