const NotificationService = require('../services/NotificationService');

exports.sendNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;
    // Internal API or Admin only? For now, open to authenticated users (e.g. triggering test notifs)
    // In production, this would be an internal event bus consumer.
    const notification = await NotificationService.sendNotification(userId, type, message);
    res.status(201).json({ status: 'success', data: { notification } });
  } catch (err) {
    next(err);
  }
};

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });
  } catch (err) {
    next(err);
  }
};
