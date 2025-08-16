import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { collections } from '../utils/firestore';
import * as admin from 'firebase-admin';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', async (req, res, next) => {
	try {
		const uid = req.user!.uid;
		const snap = await collections.users().doc(uid).get();
		return res.status(200).json({ uid, ...snap.data() });
	} catch (err) {
		return next(err);
	}
});

usersRouter.patch('/me', async (req, res, next) => {
	try {
		const uid = req.user!.uid;
		const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([, v]) => v !== undefined));
		updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
		await collections.users().doc(uid).set(updates, { merge: true });
		const snap = await collections.users().doc(uid).get();
		return res.status(200).json({ uid, ...snap.data() });
	} catch (err) {
		return next(err);
	}
});