import * as admin from 'firebase-admin';

export const db = admin.firestore();

export const collections = {
	users: () => db.collection('users'),
	startups: () => db.collection('startups'),
	projects: () => db.collection('projects'),
	applications: () => db.collection('applications'),
	tasks: () => db.collection('tasks')
};