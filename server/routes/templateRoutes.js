// server/routes/templateRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import * as templateController from '../controllers/templateController.js';

const router = express.Router();

// 1️⃣ Public: list all templates (no token needed)
router.get('/', templateController.listTemplates);

// 2️⃣ Protect everything *after* this line
router.use(verifyToken);

// 3️⃣ Now only these are guarded by the JWT check:
router.get('/new', templateController.showNewForm);
router.post('/', templateController.createTemplate);
router.get('/:id/edit', templateController.showEditForm);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

export default router;
