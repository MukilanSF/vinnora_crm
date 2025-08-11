import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Support ticket routes - Coming soon' });
});

export default router;
