const tripRouter = require('express').Router()
const Trip = require('../models/trip.js')
const multer = require('multer')
const processFile = require('../utils/proccessfile')
const dataAnalys = require('../utils/dataAnalys')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })
  
tripRouter.get('/',  async (request, response) => {
  const searchParameter = request.body.searchParameter
  const sortParameter = request.body.sort
  console.log('Search params ->', searchParameter);
  console.log('Sort params ->', sortParameter);

  try {
    const body = await Trip.find({...searchParameter}).sort({ ...sortParameter }).limit(500)
    response.json(body)
  } catch (e) {
    console.log(e.message);
  }
})

tripRouter.get('/:sid', async (request, response) => {

  const stationId = request.params.sid
//  console.log('Search params ->', stationId);
  const body  =  await dataAnalys.statistic(stationId)
  response.status(200).json(body)
})

tripRouter.post('/file', upload.single('csvFile'), async (request, response, next) => {
  const unSuccess = await processFile.processTrip(`${request.file.path}`)
  response.status(200).json(unSuccess)
  })

tripRouter.post('/reset', async (request, response) => {
  await Trip.deleteMany({})
  response.status(204).end()
})

module.exports = tripRouter