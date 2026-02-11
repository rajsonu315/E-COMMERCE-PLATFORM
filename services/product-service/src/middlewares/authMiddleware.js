const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Stateless verification: Trust the token
    req.user = decoded; 
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

exports.restrictTo = (...requiredPermissions) => {
  return (req, res, next) => {
    // req.user.permissions comes from the token
    if (!req.user.permissions) {
       return next(new AppError('No permissions found in token', 403));
    }

    const hasPermission = requiredPermissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
