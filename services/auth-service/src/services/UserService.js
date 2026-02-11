const UserRepository = require('../repositories/UserRepository');

class UserService {
  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async blockUser(id) {
    return await UserRepository.updateStatus(id, 'blocked');
  }

  async unblockUser(id) {
    return await UserRepository.updateStatus(id, 'active');
  }
}

module.exports = new UserService();
