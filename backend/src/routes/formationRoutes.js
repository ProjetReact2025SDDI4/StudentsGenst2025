import express from 'express';
import * as formationController from '../controllers/formationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/', formationController.getAll);
router.get('/categories', formationController.getCategories);
router.get('/villes', formationController.getVilles);
router.get('/:id', formationController.getById);

// Routes Admin
router.post('/', authMiddleware, isAdmin, formationController.create);
router.put('/:id', authMiddleware, isAdmin, formationController.update);
router.delete('/:id', authMiddleware, isAdmin, formationController.remove);

export default router;
