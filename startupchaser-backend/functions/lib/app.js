"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = require("./routes/auth.routes");
const error_1 = require("./middlewares/error");
const users_routes_1 = require("./routes/users.routes");
const startups_routes_1 = require("./routes/startups.routes");
const rateLimit_1 = require("./middlewares/rateLimit");
function buildApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/health', (_req, res) => res.status(200).send({ ok: true }));
    app.use('/auth', (0, rateLimit_1.rateLimit)({ windowMs: 60000, max: 50 }), auth_routes_1.authRouter);
    app.use('/users', users_routes_1.usersRouter);
    app.use('/startups', startups_routes_1.startupsRouter);
    app.use(error_1.errorHandler);
    return app;
}
