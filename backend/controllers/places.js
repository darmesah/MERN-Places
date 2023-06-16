const fs = require('fs');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');
const User = require('../model/user');

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error('Could not find a place for the provided id');
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({ place });
  } catch (error) {
    next(error);
  }
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const userPlaces = await Place.find({ creator: userId });

    res.status(201).json({ userPlaces });
  } catch (error) {
    next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid inputs passed');
      error.statusCode = 422;
      throw error;
    }

    const { title, description, address } = req.body;

    const coordinates = await getCoordsForAddress(address);

    const location = { lng: coordinates[0], lat: coordinates[1] };

    const newPlace = new Place({
      title,
      description,
      address,
      location,
      image: req.file.path,
      creator: req.userId,
    });

    await newPlace.save();

    const user = await User.findById(req.userId);
    user.places.push(newPlace);
    await user.save();

    res.status(200).json({ message: 'Place added' });
  } catch (error) {
    next(error);
  }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid inputs passed');
      error.statusCode = 422;
      throw error;
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error('Could not find a place for the provided id');
      error.statusCode = 404;
      throw error;
    }

    (place.title = title), (place.description = description);

    const updatedPlace = await place.save();

    res.status(201).json({ updatedPlace });
  } catch (error) {
    next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  try {
    const placeId = req.params.pid;

    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error('Could not find a place for the provided id');
      error.statusCode = 404;
      throw error;
    }

    const imagePath = place.image;

    await Place.findByIdAndRemove(place._id);

    const user = await User.findById(req.userId);
    user.places.pull(placeId);
    await user.save();

    fs.unlink(imagePath, (err) => {
      console.log(err);
    });

    res.status(200).json({ message: 'Deleted Place' });
  } catch (error) {
    next(error);
  }
};
