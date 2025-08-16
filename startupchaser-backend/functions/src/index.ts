import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { buildApp } from './app';

if (admin.apps.length === 0) {
	admin.initializeApp();
}

const app = buildApp();

export const api = functions.region('asia-south1').https.onRequest(app);