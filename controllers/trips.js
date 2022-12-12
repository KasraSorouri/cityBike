const tripRouter = require('express').Router()
const {parse} = require('csv-parse')
const fs = require('fs')
const Trip = require('../models/trip')
const dataAnalys = require('../utils/dataAnalys')

tripRouter.get('/', (request, response) => {
  const body = {title: 'The backend server is working!'}
  response.json(body)
})

tripRouter.get('/file', (request, response) => {
  var csvData = []
  fs.createReadStream('../file.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 , to_line: 100}))
    .on('data', function (csvrow) {
      const analysedData = dataAnalys.validateData(csvrow)
      if (analysedData) {
        const validData = new Trip(analysedData)
        validData.save()
      }
      console.log(analysedData)
    })
    .on('end', function () {
        console.log(csvData);
    })
    .on('error', function (error) {
    console.log(error.message)
    })
})

module.exports = tripRouter