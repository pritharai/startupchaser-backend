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
exports.usersRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const firestore_1 = require("../utils/firestore");
const admin = __importStar(require("firebase-admin"));
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.use(auth_1.authenticate);
exports.usersRouter.get('/me', async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const snap = await firestore_1.collections.users().doc(uid).get();
        return res.status(200).json({ uid, ...snap.data() });
    }
    catch (err) {
        return next(err);
    }
});
exports.usersRouter.patch('/me', async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([, v]) => v !== undefined));
        updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
        await firestore_1.collections.users().doc(uid).set(updates, { merge: true });
        const snap = await firestore_1.collections.users().doc(uid).get();
        return res.status(200).json({ uid, ...snap.data() });
    }
    catch (err) {
        return next(err);
    }
});
