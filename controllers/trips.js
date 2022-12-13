const tripRouter = require('express').Router()
const {parse} = require('csv-parse')
const fs = require('fs')
const Trip = require('../models/trip')
const dataAnalys = require('../utils/dataAnalys')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })
  
tripRouter.get('/', (request, response) => {
  const body = {title: 'The backend server is working!'}
  response.json(body)
})

tripRouter.post('/file', upload.single('csvFile'), async(request, response, next) => {
  var csvData = []
  const myData= await request.file.path
  console.log('file ->', myData);
  fs.createReadStream(`${request.file.path}`)
    .pipe(parse({ delimiter: ',', from_line: 2 , to_line: 10}))
    .on('data', function (csvrow) {
      const analysedData = dataAnalys.validateData(csvrow)
      if (analysedData){
        const validData = new Trip(analysedData)
        validData.save()
        csvData = csvData.concat(validData)
      }
      console.log(analysedData)
    })
    .on('end', function () {
      const dataLength = { records: csvData.length }
      response.status(200).json(dataLength)
    })
    .on('error', function (error) {
    console.log(error.message)
    })
})

module.exports = tripRouter