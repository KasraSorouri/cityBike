const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Trip = require('../models/trip')
const Station = require('../models/station')


describe('test file handeling', () => {
  test('Trip file with correct format is converted to trip model', async() => {
    await Trip.deleteMany({})
    console.log('Cleared !')
    await api
    .post('/api/files/trip')
    .field("dublicateCheck", false)
    .attach('csvFile',`${__dirname}/testTrip.csv`)
    .expect(200)
    console.log ('Data Added')
  },10000)

  test('Only valid trips add to the database', async() => {
    const trips = await Trip.find({})
    expect(trips).toHaveLength(26)
  })

  test('Dublicate trips would not be added to the database', async() => {
    await Trip.deleteMany({})
    console.log('Cleared !')
    await api
    .post('/api/files/trip')
    .field("dublicateCheck", true)
    .attach('csvFile',`${__dirname}/testTrip.csv`)
    console.log ('Data Added')
    const trips = await Trip.find({})
    expect(trips).toHaveLength(25)
  })

  test('Station file with correct format is converted to trip model', async() => {
    await Station.deleteMany({})
    console.log('Cleared !')
    await api
    .post('/api/files/station')
    .field("dublicateCheck", false)
    .attach('csvFile',`${__dirname}/testStation.csv`)
    .expect(200)
    console.log ('Data Added')
  },10000)

  test('Only valid stations add to the database', async() => {
    const stations = await Station.find({})
    expect(stations).toHaveLength(25)
  })

  test('Dublicate staions would not be added to the database', async() => {
    await Station.deleteMany({})
    console.log('Cleared !')
    await api
    .post('/api/files/station')
    .field("dublicateCheck", true)
    .attach('csvFile',`${__dirname}/testStation.csv`)
    console.log ('Data Added')
    const stations = await Station.find({})
    expect(stations).toHaveLength(24)
  })

})


afterAll(() => {
  mongoose.connection.close()
})