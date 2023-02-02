const fileRouter = require('express').Router()
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

fileRouter.post('/trip', upload.single('csvFile'), async (request, response) => {
  const duplicateCheck = request.body.duplicateCheck
  const onSuccess = await processFile.processTrip(`${request.file.path}`,duplicateCheck)
  response.status(200).json(onSuccess)
})

fileRouter.post('/station', upload.single('csvFile'), async (request, response) => {
  const duplicateCheck = request.body.duplicateCheck
  const onSuccess = await processFile.processStation(`${request.file.path}`,duplicateCheck)
  response.status(200).json(onSuccess)
})


module.exports = fileRouter