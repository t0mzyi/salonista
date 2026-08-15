import * as userModel from '../models/userModel.js';

export const verifyAndSyncUser = async (phone, name) => {
  if (!phone) throw new Error('Phone number is required');
  return await userModel.upsertUser(phone, name || 'Salonista Customer');
};

export const fetchUserProfile = async (phone) => {
  if (!phone) throw new Error('Phone number is required');
  return await userModel.getUserByPhone(phone);
};
