const AuthService = require('../services/AuthService');
const catchAsync = require('../utils/catchAsync'); // Helper to avoid try-catch blocks

// Define catchAsync inline or create a file. I'll define it in utils later, for now inline wrapper logic
// Actually, let's create utils/catchAsync.js first.

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    
    // In a real app, we might set cookie here too
    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};
