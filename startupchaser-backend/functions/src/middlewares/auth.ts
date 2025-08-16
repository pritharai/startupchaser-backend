import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { collections } from '../utils/firestore';

export interface AuthenticatedUser {
	uid: string;
	email?: string;
	profile_type?: 'student' | 'startup';
}

type TokenSource = 'id' | 'session';

async function getTokenFromRequest(req: Request): Promise<{ token: string; source: TokenSource } | null> {
	const authHeader = req.headers.authorization || '';
	if (authHeader.startsWith('Bearer ')) return { token: authHeader.substring(7), source: 'id' };
	const cookieToken = (req.cookies && (req.cookies.__session || req.cookies.token)) as string | undefined;
	if (cookieToken) return { token: cookieToken, source: 'session' };
	return null;
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		const tokenRef = await getTokenFromRequest(req);
		if (!tokenRef) return res.status(401).json({ message: 'Missing auth token' });
		const decoded = tokenRef.source === 'session'
			? await admin.auth().verifySessionCookie(tokenRef.token, true)
			: await admin.auth().verifyIdToken(tokenRef.token);
		const uid = decoded.uid;
		let profile_type: 'student' | 'startup' | undefined = (decoded as any).profile_type as any;
		if (!profile_type) {
			try {
				const userDoc = await collections.users().doc(uid).get();
				profile_type = (userDoc.data()?.profile_type as 'student' | 'startup' | undefined) ?? undefined;
			} catch {
				profile_type = undefined;
			}
		}
		req.user = { uid, email: (decoded as any).email ?? undefined, profile_type };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid auth token' });
	}
}

export function requireRole(roles: Array<'student' | 'startup'>) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.profile_type || !roles.includes(req.user.profile_type)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next();
	};
}