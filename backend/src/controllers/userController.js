import * as userService from '../services/userService.js';

export const syncUser = async (req, res, next) => {
  try {
    const { phone, name } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    const user = await userService.verifyAndSyncUser(phone, name);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { phone } = req.params;
    const user = await userService.fetchUserProfile(phone);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.fetchAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;
    const user = await userService.toggleUserBlock(id, is_blocked);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
