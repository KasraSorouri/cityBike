const stationRouter = require('express').Router()
const Station = require('../models/station')
const dataAnalys = require('../utils/dataAnalys')

stationRouter.get('/:page/:rowsPerPage',  async (request, response) => {
  const searchParameter = request.body.searchParameter
  const sortParameter = request.body.sort
  const page = request.params.page
  const rows = request.params.rowsPerPage
  console.log('pagination * page ->', request.params.page, '   rows ->', rows)
  console.log('Search params ->', searchParameter);
  console.log('Sort params ->', sortParameter);

  try {
    const totalStations = await Station.countDocuments()
    const stations = await Station.find({...searchParameter}).sort({ ...sortParameter }).skip(page*rows).limit(rows)
    const body = { stations, totalStations }
    response.json(body)
  } catch (e) {
    console.log(e.message);
  }
})

stationRouter.get('/:sid', async (request, response) => {

  const stationId = request.params.sid
//  console.log('Search params ->', stationId);
  const body  =  await dataAnalys.statistic(stationId)
  response.status(200).json(body)
})

module.exports = stationRouter