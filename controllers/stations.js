const stationRouter = require('express').Router()
const Station = require('../models/station')
const dataAnalys = require('../utils/dataAnalys')


stationRouter.get('/', async (request, response) => {
  
  const body =  await Station.find({})
  response.status(200).json(body)
  
})


stationRouter.get('/:sid', async (request, response) => {
  const sid = request.params.sid
  const body  =  await dataAnalys.statistic(sid)
  if (body){
    response.status(200).json(body)
  }
  response.status(404).json({error : 'station not found!'})
})

module.exports = stationRouter