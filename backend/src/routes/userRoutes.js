import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/sync - Save / Update user after verification
router.post('/sync', userController.syncUser);

// GET /api/users/:phone - Get user profile
router.get('/:phone', userController.getProfile);

export default router;
