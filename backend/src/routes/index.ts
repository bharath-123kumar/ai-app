import { Router } from 'express';
import { authController } from '../controllers/auth';
import { dynamicController } from '../controllers/dynamic';
import { authMiddleware } from '../middleware/auth';
import { csvImportController } from '../controllers/csvImport';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();
router.get('/', (req, res) => res.json({ status: 'API is working' }));

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Dynamic CRUD Routes
router.get('/:table', authMiddleware, dynamicController.getAll);
router.post('/:table', authMiddleware, dynamicController.create);
router.put('/:table/:id', authMiddleware, dynamicController.update);
router.delete('/:table/:id', authMiddleware, dynamicController.delete);

// CSV Import Route
router.post('/:table/import', authMiddleware, upload.single('file'), csvImportController.import);

export default router;
