const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Place', placeSchema);
