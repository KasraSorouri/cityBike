const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Trip = require('../models/trip')
const Station = require('../models/station')


describe('Receive trips', () => {
  const initialize = async() => {
    await Trip.deleteMany({})
    console.log ('Data Cleared!')
  
    await api
    .post('/api/files/trip')
    .field("duplicateCheck", false)
    .attach('csvFile',`${__dirname}/testTrip.csv`)

    console.log ('Data Added')
  }

  test('trips are returned as json', async () => {
    await api
        .get('/api/trips/0/1')
        .expect(200)
        .expect('content-type', /application\/json/)
  })
 
  test('Return all trips', async () => {
    const response = await api.get('/api/trips/0/100')
    expect(response.body.totalTrips).toBe(25)
    expect(response.body.trips).toHaveLength(25)

  })

  test('Pagination test', async () => {
    const response = await api.get('/api/trips/0/10')
    expect(response.body.trips).toHaveLength(10)
    expect(response.body.trips[9].departureStationId).toBe('116')
    expect(response.body.trips[9].returnStationId).toBe('145')
  })

  test('Test filters', async () => {
    const filter = 'originStation=004&destinationStation=null&durationFrom=5&durationTo=null&distanceFrom=null&distanceTo=2&start=2021-05-09T21%3A00%3A11.000Z&end=null'
    const response = await api.get(`/api/trips/0/10?${filter}`)
    expect(response.body.trips).toHaveLength(1)
    expect(response.body.trips[0].departureStationId).toBe('004')
    expect(response.body.trips[0].returnStationId).toBe('133')
  })  
})

describe('Receive Stations', () => {
  const initialize = async() => {
    await Station.deleteMany({})
    console.log ('Data Cleared!')

    await api
    .post('/api/files/station')
    .field("duplicateCheck", true)
    .attach('csvFile',`${__dirname}/testStation.csv`)

    console.log ('Data Added')
  }
  test('Stations are returned as json', async () => {
    await api
        .get('/api/stations')
        .expect(200)
        .expect('content-type', /application\/json/)
  })
 
  test('Return all stations', async () => {
    const response = await api.get('/api/stations')
    expect(response.body).toHaveLength(24)
  })
})

afterAll(() => {
  mongoose.connection.close()
})