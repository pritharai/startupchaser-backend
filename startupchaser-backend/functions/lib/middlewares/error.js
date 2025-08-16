"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const isKnown = typeof err === 'object' && err !== null && 'status' in err;
    if (isKnown) {
        const anyErr = err;
        return res.status(anyErr.status ?? 400).json({ message: anyErr.message ?? 'Bad request', code: anyErr.code, details: anyErr.details });
    }
    console.error('Unhandled error', err);
    return res.status(500).json({ message: 'Internal server error' });
}
