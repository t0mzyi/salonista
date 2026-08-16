import * as userModel from '../models/userModel.js';

export const verifyAndSyncUser = async (phone, name) => {
  if (!phone) throw new Error('Phone number is required');
  return await userModel.upsertUser(phone, name || 'Salonista Customer');
};

export const fetchUserProfile = async (phone) => {
  if (!phone) throw new Error('Phone number is required');
  return await userModel.getUserByPhone(phone);
};

export const fetchAllUsers = async () => {
  return await userModel.getAllUsers();
};

export const toggleUserBlock = async (id, isBlocked) => {
  if (!id) throw new Error('User ID is required');
  return await userModel.updateUserBlockStatus(id, Boolean(isBlocked));
};
