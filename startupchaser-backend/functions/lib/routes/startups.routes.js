"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startupsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
exports.startupsRouter = (0, express_1.Router)();
exports.startupsRouter.use(auth_1.authenticate, (0, auth_1.requireRole)(['startup']));
exports.startupsRouter.get('/dashboard', async (req, res) => {
    return res.status(200).json({ message: `Welcome startup ${req.user?.uid}` });
});
