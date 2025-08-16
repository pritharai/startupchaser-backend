import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';

export const startupsRouter = Router();

startupsRouter.use(authenticate, requireRole(['startup']));

startupsRouter.get('/dashboard', async (req, res) => {
	return res.status(200).json({ message: `Welcome startup ${req.user?.uid}` });
});