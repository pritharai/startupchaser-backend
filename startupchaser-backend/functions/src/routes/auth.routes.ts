import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { SignInSchema, SignUpSchema } from '../utils/validators';
import { collections } from '../utils/firestore';
import { authenticate } from '../middlewares/auth';

export const authRouter = Router();

async function createSessionCookie(idToken: string) {
	// 5 days session
	const expiresInMs = 5 * 24 * 60 * 60 * 1000;
	return admin.auth().createSessionCookie(idToken, { expiresIn: expiresInMs });
}

authRouter.get('/me', authenticate, async (req, res) => {
	return res.status(200).json({ uid: req.user?.uid, email: req.user?.email, profile_type: req.user?.profile_type });
});

authRouter.post('/signup', async (req, res, next) => {
	try {
		const parsed = SignUpSchema.parse(req.body);
		const userRecord = await admin.auth().createUser({
			email: parsed.email,
			emailVerified: false,
			password: parsed.password,
			displayName: parsed.name,
			disabled: false
		});
		const userDoc = {
			name: parsed.name,
			email: parsed.email,
			profile_type: parsed.profile_type,
			skills: parsed.skills ?? [],
			bio: parsed.bio ?? '',
			created_at: admin.firestore.FieldValue.serverTimestamp(),
			updated_at: admin.firestore.FieldValue.serverTimestamp()
		};
		await collections.users().doc(userRecord.uid).set(userDoc, { merge: true });
		await admin.auth().setCustomUserClaims(userRecord.uid, { profile_type: parsed.profile_type });
		const customToken = await admin.auth().createCustomToken(userRecord.uid, {
			profile_type: parsed.profile_type
		});
		return res.status(201).json({ uid: userRecord.uid, customToken });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ message: 'Invalid input', issues: err.issues });
		if (typeof err === 'object' && err && 'code' in (err as any)) {
			const e = err as any;
			if (e.code === 'auth/email-already-exists') return res.status(409).json({ message: 'Email already in use' });
		}
		return next(err);
	}
});

authRouter.post('/signin', async (req, res, next) => {
	try {
		const parsed = SignInSchema.parse(req.body);
		const idToken = parsed.idToken;
		const sessionCookie = await createSessionCookie(idToken);
		const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
		const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || !!process.env.FIREBASE_AUTH_EMULATOR_HOST;
		const cookieOptions: any = { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: !isEmulator, sameSite: isEmulator ? 'lax' : 'none', path: '/' };
		res.cookie('__session', sessionCookie, cookieOptions);
		return res.status(200).json({ uid: decodedClaims.uid });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ message: 'Invalid input', issues: err.issues });
		return next(err);
	}
});

authRouter.post('/signout', async (_req, res, next) => {
	try {
		res.clearCookie('__session', { path: '/' });
		return res.status(200).json({ ok: true });
	} catch (err) {
		return next(err);
	}
});