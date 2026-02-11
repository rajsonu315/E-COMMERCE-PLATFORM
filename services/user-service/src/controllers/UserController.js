const UserService = require('../services/UserService');

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await UserService.getProfile(req.user.id);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await UserService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (err) {
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await UserService.getAddresses(req.user.id);
    res.status(200).json({ status: 'success', results: addresses.length, data: { addresses } });
  } catch (err) {
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const address = await UserService.addAddress(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: { address } });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    await UserService.deleteAddress(req.user.id, req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
