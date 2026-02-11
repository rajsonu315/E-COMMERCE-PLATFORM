const UserProfileRepository = require('../repositories/UserProfileRepository');
const AddressRepository = require('../repositories/AddressRepository');

class UserService {
  async getProfile(userId) {
    return await UserProfileRepository.findByUserId(userId);
  }

  async updateProfile(userId, data) {
    return await UserProfileRepository.upsert(userId, data);
  }

  async getAddresses(userId) {
    return await AddressRepository.findAllByUserId(userId);
  }

  async addAddress(userId, data) {
    return await AddressRepository.create(userId, data);
  }

  async deleteAddress(userId, addressId) {
    return await AddressRepository.delete(addressId, userId);
  }
}

module.exports = new UserService();
