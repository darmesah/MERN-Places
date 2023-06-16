const express = require('express');
const { body } = require('express-validator');

const placesController = require('../controllers/places');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlacesByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    body('title').not().isEmpty(),
    body('description').isLength({ min: 5 }),
    body('address').not().isEmpty(),
  ],
  placesController.createPlace
);

router.patch(
  '/:pid',
  [body('title').not().isEmpty(), body('description').isLength({ min: 5 })],
  placesController.updatePlace
);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;
