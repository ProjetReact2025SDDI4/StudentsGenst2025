import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Routes protégées
router.get('/me', authMiddleware, authController.getMe);
router.put('/me', authMiddleware, authController.updateProfile);
router.put('/password', authMiddleware, authController.changePassword);

// Routes Admin
router.post('/register', authMiddleware, isAdmin, authController.register);
router.get('/users', authMiddleware, isAdmin, authController.getAllUsers);

export default router;
