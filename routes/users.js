import { Router } from 'express';
import {
  readAll, readById, update, updateAvatar,
} from '../controllers/users.js';
import {
  // celebrateBodyAuth,
  // celebrateBodyUser,
  celebrateParamsRouteMe,
  celebrateBodyAvatar,
  celebrateBodyProfile,
} from '../validators/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', celebrateParamsRouteMe, readById);
router.patch('/me', celebrateBodyProfile, update);
router.patch('/me/avatar', celebrateBodyAvatar, updateAvatar);
// router.post('/signin', celebrateBodyAuth, login);
// router.post('/signup', celebrateBodyUser, create);
