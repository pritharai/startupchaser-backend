import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
