const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const UserRepository = require('../repositories/UserRepository');

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
    
    // Check if user still exists
    const currentUser = await UserRepository.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access
    req.user = currentUser;
    req.user.permissions = decoded.permissions; // Optimisation: from token
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

exports.restrictTo = (...requiredPermissions) => {
  return (req, res, next) => {
    // Check if user has at least one of the required permissions (OR logic) or ALL (AND logic)?
    // Usually RBAC checks if user has the specific permission for the action.
    // If we pass multiple, it usually means "any of these roles".
    // But here we are using permissions.
    
    // Let's assume requiredPermissions is an array of strings.
    // req.user.permissions is an array of strings.
    
    // Check if ANY required permission is present
    const hasPermission = requiredPermissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
