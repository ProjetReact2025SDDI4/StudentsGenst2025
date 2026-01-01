import express from 'express';
import * as planningController from '../controllers/planningController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAssistant } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Routes lecture accessibles à tout utilisateur authentifié
router.get('/', authMiddleware, planningController.getAll);
router.get('/formateur/:formateurId', authMiddleware, planningController.getByFormateur);
router.get('/:id', authMiddleware, planningController.getById);
router.post('/', authMiddleware, isAdminOrAssistant, planningController.create);
router.put('/:id', authMiddleware, isAdminOrAssistant, planningController.update);

// Route Admin uniquement
router.delete('/:id', authMiddleware, isAdmin, planningController.remove);

export default router;
