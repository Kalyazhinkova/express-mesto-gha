import { Router } from 'express';
import {
  readAll, readById, create, update,
} from '../controllers/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', readById);
router.post('/', create);
router.patch('/me', update);
router.patch('/me/avatar', update);
