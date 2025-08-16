import { Request, Response, NextFunction } from 'express';

const ipToHits: Record<string, { count: number; resetAt: number }> = {};

export function rateLimit(options: { windowMs: number; max: number }) {
	return (req: Request, res: Response, next: NextFunction) => {
		const now = Date.now();
		const key = (req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown').split(',')[0].trim();
		const entry = ipToHits[key] ?? { count: 0, resetAt: now + options.windowMs };
		if (now > entry.resetAt) {
			entry.count = 0;
			entry.resetAt = now + options.windowMs;
		}
		entry.count += 1;
		ipToHits[key] = entry;
		if (entry.count > options.max) {
			const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
			res.setHeader('Retry-After', String(retryAfterSec));
			return res.status(429).json({ message: 'Too many requests. Please try again later.' });
		}
		next();
	};
}