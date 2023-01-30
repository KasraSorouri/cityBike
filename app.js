const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const tripRouter = require('./controllers/trips')
const stationRouter = require('./controllers/stations')
const fileRouter = require('./controllers/files')
const parameterRouter = require('./controllers/parameters')

const mongoose = require('mongoose').set('strictQuery',false)

logger.info('connecting to ',config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('erroe connecting to MongoDB:',error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/trips', tripRouter)
app.use('/api/stations', stationRouter)
app.use('/api/files', fileRouter)
app.use('/api/parameter', parameterRouter)

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testRouter')
  app.use('/test', testRouter)

}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app