const express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/users');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    body('name').not().isEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }),
  ],
  usersController.signup
);

router.post('/login', body('email').normalizeEmail(), usersController.login);

module.exports = router;
