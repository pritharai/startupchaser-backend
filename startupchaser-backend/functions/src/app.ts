import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middlewares/error';
import { usersRouter } from './routes/users.routes';
import { startupsRouter } from './routes/startups.routes';
import { rateLimit } from './middlewares/rateLimit';

export function buildApp() {
	const app = express();
	app.use(cors({ origin: true, credentials: true }));
	app.use(express.json());
	app.use(cookieParser());

	app.get('/health', (_req, res) => res.status(200).send({ ok: true }));

	app.use('/auth', rateLimit({ windowMs: 60_000, max: 50 }), authRouter);
	app.use('/users', usersRouter);
	app.use('/startups', startupsRouter);

	app.use(errorHandler);
	return app;
}