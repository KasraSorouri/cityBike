const tripRouter = require('express').Router()

tripRouter.get('/', (request, response) => {
  const body = {title: 'The backend server is working!'}
  response.json(body)
})

module.exports = tripRouter