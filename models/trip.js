const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  departure: {
    type: Date,
    required: true,
  },
  return: {
    type: Date,
    required: true,
  },
  departureStationId: {
    type: String,
    required: true,
  },
  departureStationName: {
    type: String,
    required: true,
  },
  returnStationId: {
    type: String,
    required: true,
  },
  returnStationName: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
})

tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    returnedObject.distance = returnedObject.distance / 1000
    returnedObject.duration = returnedObject.duration / 60
  }
})

module.exports = mongoose.model('Trip', tripSchema)