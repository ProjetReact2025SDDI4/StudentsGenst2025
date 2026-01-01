import express from 'express';
import * as formationController from '../controllers/formationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAssistant } from '../middlewares/roleMiddleware.js';
import { imageUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/', formationController.getAll);
router.get('/categories', formationController.getCategories);
router.get('/villes', formationController.getVilles);
router.get('/:id', formationController.getById);

// Routes Admin ou Assistant (création / mise à jour)
router.post('/', authMiddleware, isAdminOrAssistant, imageUpload.single('image'), formationController.create);
router.put('/:id', authMiddleware, isAdminOrAssistant, imageUpload.single('image'), formationController.update);

// Suppression réservée à l'Admin
router.delete('/:id', authMiddleware, isAdmin, formationController.remove);

export default router;
