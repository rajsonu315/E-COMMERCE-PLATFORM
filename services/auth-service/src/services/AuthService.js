const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/AppError');

class AuthService {
  async register(email, password, roleId = 2) { // Default role 2 (customer)
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = await UserRepository.create({ email, passwordHash, roleId });
    
    return { id: userId, email, roleId };
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError('Invalid email or password', 401);
    }
    
    const permissions = await UserRepository.getUserPermissions(user.id);

    const token = this.signToken(user.id, user.role_id, permissions);
    return { user: { id: user.id, email: user.email, roleId: user.role_id, permissions }, token };
  }

  signToken(id, roleId, permissions) {
    return jwt.sign({ id, roleId, permissions }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }
}

module.exports = new AuthService();
