import express from 'express';
import * as inscriptionController from '../controllers/inscriptionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdminOrAssistant } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route publique - inscription
router.post('/', inscriptionController.create);

// Routes Admin ou Assistant
router.get('/', authMiddleware, isAdminOrAssistant, inscriptionController.getAll);
router.get('/formation/:formationId', authMiddleware, isAdminOrAssistant, inscriptionController.getByFormation);
router.get('/:id', authMiddleware, isAdminOrAssistant, inscriptionController.getById);
router.put('/:id', authMiddleware, isAdminOrAssistant, inscriptionController.update);

export default router;
