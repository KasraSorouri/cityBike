const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
  fid: {
    type: String,
    required: true,
  },
  stationId: {
    type: String,
    required: true,
  },
  nameFinnish: {
    type: String,
    required: true,
  },
  nameSwedish: {
    type: String,
    required: true,
  },
  nameEnglish: {
    type: String,
    required: true,
  },
  addressFinnish: {
    type: String,
    required: true,
  },
  addrressEnglish: {
    type: String,
    required: true,
  },
  cityFinnish: {
    type: String,
    required: true,
  },
  citySwedish: {
    type: String,
    required: true,
  },
  opperator: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    longtitude: Number,
    latitude: Number
  }
})

stationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Station', stationSchema)