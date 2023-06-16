const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      const error = new Error('Not authenticated. ');
      error.statusCode = 401;
      throw error;
    }

    const token = req.get('Authorization').split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      const error = new Error('Not authenticated. ');
      error.statusCode = 500;
      throw error;
    }

    req.userId = decodedToken.userId;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

  next();
};

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];

//     if (!token) {
//       const error = new Error('Not authenticated. ');
//       error.statusCode = 401;
//       throw error;
//     }

//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

//     if (!decodedToken) {
//       const error = new Error('Not authenticated. ');
//       error.statusCode = 401;
//       throw error;
//     }

//     req.userId = decodedToken.userId;
//   } catch (error) {
//     error.statusCode = 500;
//     throw error;
//   }

//   next();
// };
