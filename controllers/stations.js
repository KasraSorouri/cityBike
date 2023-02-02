const stationRouter = require('express').Router()
const Station = require('../models/station')
const dataAnalys = require('../utils/dataAnalys')


stationRouter.get('/', async (request, response) => {
  const body =  await Station.find({})
  response.status(200).json(body)
})

stationRouter.get('/:sid', async (request, response) => {
  const sid = request.params.sid
  const filter = request.query
  let searchParameter = {}

  filter.start !== 'null' ? searchParameter.departure= { $gte: new Date(filter.start) } : null
  filter.end !== 'null' ? searchParameter.return= { $lte: new Date(filter.end) } : null

  const body  =  await dataAnalys.statistic(sid,searchParameter)
  if (body){
    response.status(200).json(body)
  } else {
    response.status(404).json({ error : 'station not found!' })
  }
})

module.exports = stationRouter