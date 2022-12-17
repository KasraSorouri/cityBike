const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const tripRouter = require('./controllers/trips')
const fileRouter = require('./controllers/files')
const testRouter = require('./controllers/testRouter')

const mongoose = require('mongoose')

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

app.use('/api/trips', tripRouter)
app.use('/api/files', fileRouter)
app.use('/test', testRouter)


app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app