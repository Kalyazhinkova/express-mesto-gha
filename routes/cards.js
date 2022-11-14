import { Router } from 'express';
import {
  read, create, remove, likeCard, dislikeCard,
} from '../controllers/cards.js';

export const router = Router();

router.get('/', read);
router.post('/', create);
router.delete('/:id', remove);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);
