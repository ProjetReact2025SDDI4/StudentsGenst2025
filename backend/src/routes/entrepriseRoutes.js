import express from 'express';
import * as entrepriseController from '../controllers/entrepriseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAssistant } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Routes Admin ou Assistant
router.get('/', authMiddleware, isAdminOrAssistant, entrepriseController.getAll);
router.get('/:id', authMiddleware, isAdminOrAssistant, entrepriseController.getById);
router.post('/', authMiddleware, isAdminOrAssistant, entrepriseController.create);
router.put('/:id', authMiddleware, isAdminOrAssistant, entrepriseController.update);

// Route Admin uniquement
router.delete('/:id', authMiddleware, isAdmin, entrepriseController.remove);

export default router;
