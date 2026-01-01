import express from 'express';
import * as candidatureController from '../controllers/candidatureController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { documentUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Route publique - soumettre une candidature avec CV et documents
router.post('/', documentUpload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), candidatureController.create);

// Routes Admin
router.get('/', authMiddleware, isAdmin, candidatureController.getAll);
router.get('/:id', authMiddleware, isAdmin, candidatureController.getById);
router.put('/:id/accept', authMiddleware, isAdmin, candidatureController.accept);
router.put('/:id/reject', authMiddleware, isAdmin, candidatureController.reject);

export default router;
