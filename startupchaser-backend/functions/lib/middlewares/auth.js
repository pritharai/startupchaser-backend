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
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("../utils/firestore");
async function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer '))
        return { token: authHeader.substring(7), source: 'id' };
    const cookieToken = (req.cookies && (req.cookies.__session || req.cookies.token));
    if (cookieToken)
        return { token: cookieToken, source: 'session' };
    return null;
}
async function authenticate(req, res, next) {
    try {
        const tokenRef = await getTokenFromRequest(req);
        if (!tokenRef)
            return res.status(401).json({ message: 'Missing auth token' });
        const decoded = tokenRef.source === 'session'
            ? await admin.auth().verifySessionCookie(tokenRef.token, true)
            : await admin.auth().verifyIdToken(tokenRef.token);
        const uid = decoded.uid;
        let profile_type = decoded.profile_type;
        if (!profile_type) {
            try {
                const userDoc = await firestore_1.collections.users().doc(uid).get();
                profile_type = userDoc.data()?.profile_type ?? undefined;
            }
            catch {
                profile_type = undefined;
            }
        }
        req.user = { uid, email: decoded.email ?? undefined, profile_type };
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid auth token' });
    }
}
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user?.profile_type || !roles.includes(req.user.profile_type)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}
