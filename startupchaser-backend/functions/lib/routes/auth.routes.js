"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
const validators_1 = require("../utils/validators");
const firestore_1 = require("../utils/firestore");
const auth_1 = require("../middlewares/auth");
exports.authRouter = (0, express_1.Router)();
async function createSessionCookie(idToken) {
    // 5 days session
    const expiresInMs = 5 * 24 * 60 * 60 * 1000;
    return admin.auth().createSessionCookie(idToken, { expiresIn: expiresInMs });
}
exports.authRouter.get('/me', auth_1.authenticate, async (req, res) => {
    return res.status(200).json({ uid: req.user?.uid, email: req.user?.email, profile_type: req.user?.profile_type });
});
exports.authRouter.post('/signup', async (req, res, next) => {
    try {
        const parsed = validators_1.SignUpSchema.parse(req.body);
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
        await firestore_1.collections.users().doc(userRecord.uid).set(userDoc, { merge: true });
        await admin.auth().setCustomUserClaims(userRecord.uid, { profile_type: parsed.profile_type });
        const customToken = await admin.auth().createCustomToken(userRecord.uid, {
            profile_type: parsed.profile_type
        });
        return res.status(201).json({ uid: userRecord.uid, customToken });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: 'Invalid input', issues: err.issues });
        if (typeof err === 'object' && err && 'code' in err) {
            const e = err;
            if (e.code === 'auth/email-already-exists')
                return res.status(409).json({ message: 'Email already in use' });
        }
        return next(err);
    }
});
exports.authRouter.post('/signin', async (req, res, next) => {
    try {
        const parsed = validators_1.SignInSchema.parse(req.body);
        const idToken = parsed.idToken;
        const sessionCookie = await createSessionCookie(idToken);
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || !!process.env.FIREBASE_AUTH_EMULATOR_HOST;
        const cookieOptions = { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true, secure: !isEmulator, sameSite: isEmulator ? 'lax' : 'none', path: '/' };
        res.cookie('__session', sessionCookie, cookieOptions);
        return res.status(200).json({ uid: decodedClaims.uid });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: 'Invalid input', issues: err.issues });
        return next(err);
    }
});
exports.authRouter.post('/signout', async (_req, res, next) => {
    try {
        res.clearCookie('__session', { path: '/' });
        return res.status(200).json({ ok: true });
    }
    catch (err) {
        return next(err);
    }
});
