const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
  async sendNotification(userId, type, message) {
    // 1. In a real system, send email/SMS/Push
    console.log(`[NOTIFICATION] To User ${userId} [${type}]: ${message}`);

    // 2. Save to DB
    const id = await NotificationRepository.create(userId, type, message);
    return { id, userId, type, message };
  }

  async getUserNotifications(userId) {
    return await NotificationRepository.findByUserId(userId);
  }
}

module.exports = new NotificationService();
