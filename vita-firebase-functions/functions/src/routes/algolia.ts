import { Router } from 'express';
import {
  searchWithAlgolia,
  syncAvailabilityToAlgolia,
  syncProUsersToAlgolia,
} from '../services/algolia/algolia';

const router = Router();

router.post('/sync-pro-users-to-algolia', syncProUsersToAlgolia);
router.post('/search', searchWithAlgolia);
router.post('/sync-availability', syncAvailabilityToAlgolia)

export default router;
