import express from 'express';
import * as formateurController from '../controllers/formateurController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Toutes les routes sont protégées Admin
router.use(authMiddleware, isAdmin);

router.get('/', formateurController.getAll);
router.get('/:id', formateurController.getById);
router.post('/', formateurController.create);
router.put('/:id', formateurController.update);
router.delete('/:id', formateurController.remove);

export default router;
