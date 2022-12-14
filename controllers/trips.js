const tripRouter = require('express').Router()
const Trip = require('../models/trip')
const multer = require('multer')
const processFile = require('../utils/proccessfile')

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

tripRouter.post('/file', upload.single('csvFile'), async (request, response, next) => {
  const unSuccess = await processFile(`${request.file.path}`)
  response.status(200).json(unSuccess)
  })

tripRouter.post('/reset', async (request, response) => {
  await Trip.deleteMany({})
  response.status(204).end()
})

module.exports = tripRouter