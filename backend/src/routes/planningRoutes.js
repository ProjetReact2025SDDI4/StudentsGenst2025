import express from 'express';
import * as planningController from '../controllers/planningController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAssistant } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Routes Admin ou Assistant
router.get('/', authMiddleware, isAdminOrAssistant, planningController.getAll);
router.get('/formateur/:formateurId', authMiddleware, planningController.getByFormateur);
router.get('/:id', authMiddleware, isAdminOrAssistant, planningController.getById);
router.post('/', authMiddleware, isAdminOrAssistant, planningController.create);
router.put('/:id', authMiddleware, isAdminOrAssistant, planningController.update);

// Route Admin uniquement
router.delete('/:id', authMiddleware, isAdmin, planningController.remove);

export default router;
