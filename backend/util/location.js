const axios = require('axios');

const API_KEY = process.env.MAPBOX_API_KEY;

const getCoordsForAddress = async (address) => {
  //   return {
  //     lng: -73.9871516,
  //     lat: 40.7484474,
  //   };

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${API_KEY}`
  );

  const data = response.data;

  if (data.features.length < 1) {
    const error = new Error('Unable to get location');
    error.statusCode = 422;
    throw error;
  }

  const coordinates = data.features[0].geometry.coordinates;

  return coordinates;
};

module.exports = getCoordsForAddress;
