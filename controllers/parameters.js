const parameterRouter = require('express').Router()
const dataAnalys = require('../utils/dataAnalys')


parameterRouter.get('/', async(request, response) => {
  try {
    const body = await dataAnalys.filterParameter() 
    //console.log('body', body)
    response.status(200).json(body)

  } catch (e) {
    response.status(500).json(e)
  }

})

module.exports = parameterRouter