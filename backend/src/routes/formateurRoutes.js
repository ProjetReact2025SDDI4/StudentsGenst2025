import express from 'express';
import * as formateurController from '../controllers/formateurController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAssistant } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Lecture formateurs : Admin ou Assistant
router.get('/', authMiddleware, isAdminOrAssistant, formateurController.getAll);
router.get('/:id', authMiddleware, isAdminOrAssistant, formateurController.getById);

// Gestion formateurs : Admin uniquement
router.post('/', authMiddleware, isAdmin, formateurController.create);
router.put('/:id', authMiddleware, isAdmin, formateurController.update);
router.delete('/:id', authMiddleware, isAdmin, formateurController.remove);

export default router;
