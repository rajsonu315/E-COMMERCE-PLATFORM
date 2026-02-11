const UserService = require('../services/UserService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) {
    next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    await UserService.blockUser(req.params.id);
    res.status(200).json({ status: 'success', message: 'User blocked' });
  } catch (err) {
    next(err);
  }
};

exports.unblockUser = async (req, res, next) => {
    try {
      await UserService.unblockUser(req.params.id);
      res.status(200).json({ status: 'success', message: 'User unblocked' });
    } catch (err) {
      next(err);
    }
  };
