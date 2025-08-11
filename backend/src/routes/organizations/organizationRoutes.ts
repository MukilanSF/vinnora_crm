import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Organization routes - Coming soon' });
});

export default router;
