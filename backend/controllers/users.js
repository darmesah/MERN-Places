const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Error');
      error.statusCode = 422;
      throw error;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: [],
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({
      message: 'User Created Sucessfully',
      token,
      userId: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('No account matched with that email');
      error.statusCode = 401;
      throw error;
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      const error = new Error('Invalid login credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    next(error);
  }
};
