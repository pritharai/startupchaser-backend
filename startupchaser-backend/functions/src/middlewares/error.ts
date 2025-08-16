import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
	const isKnown = typeof err === 'object' && err !== null && 'status' in (err as Record<string, unknown>);
	if (isKnown) {
		const anyErr = err as { status?: number; message?: string; code?: string; details?: unknown };
		return res.status(anyErr.status ?? 400).json({ message: anyErr.message ?? 'Bad request', code: anyErr.code, details: anyErr.details });
	}
	console.error('Unhandled error', err);
	return res.status(500).json({ message: 'Internal server error' });
}