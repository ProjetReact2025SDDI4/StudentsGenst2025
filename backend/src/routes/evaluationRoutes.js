import express from 'express';
import * as evaluationController from '../controllers/evaluationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route publique - soumettre une évaluation
router.post('/', evaluationController.create);

// Routes Admin
router.get('/', authMiddleware, isAdmin, evaluationController.getAll);
router.get('/formateur/:formateurId/stats', authMiddleware, isAdmin, evaluationController.getStatsByFormateur);
router.get('/formation/:formationId/stats', authMiddleware, isAdmin, evaluationController.getStatsByFormation);
router.get('/:id', authMiddleware, isAdmin, evaluationController.getById);

export default router;
