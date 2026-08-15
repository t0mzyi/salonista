import express from 'express';
import { salonController } from '../controllers/salonController.js';

const router = express.Router();

router.get('/', salonController.getSalons);
router.get('/:id', salonController.getSalon);
router.post('/', salonController.createSalon);
router.put('/:id', salonController.updateSalon);

export default router;

