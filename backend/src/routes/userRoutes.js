import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', userController.getUsers);

// POST /api/users/sync - Save / Update user after verification
router.post('/sync', userController.syncUser);

// GET /api/users/:phone - Get user profile
router.get('/:phone', userController.getProfile);

// PATCH /api/users/:id/block - Block or unblock user
router.patch('/:id/block', userController.updateUserBlock);

export default router;
