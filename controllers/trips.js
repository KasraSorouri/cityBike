const tripRouter = require('express').Router()
const {parse, Parser} = require('csv-parse')
const fs = require('fs')
const Trip = require('../models/trip')
const dataAnalys = require('../utils/dataAnalys')
const multer = require('multer')
const { info } = require('console')

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
  var inValidData = []
  fs.createReadStream(`${request.file.path}`)
    .pipe(parse({ delimiter: ',', from_line: 2 , to_line: 10 }))
    .on('data', function (csvrow) {
      const analysedData = dataAnalys.validateData(csvrow)
      if (analysedData.validation){
        const validData = new Trip(analysedData.rowData)
        validData.save()
        csvData = csvData.concat(validData)
      }
      if (!analysedData.validation){
        inValidData = inValidData.concat(analysedData)
      }
    })
    .on('end', function () {
      const unSuccess = inValidData.map(data => data.reason)
      response.status(200).json({ 'records': csvData.length, unSuccess })
    })
    .on('error', function (error) {
    console.log(error.message)
    })
})
  


module.exports = tripRouter