"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = exports.SignUpSchema = exports.ProfileTypeSchema = void 0;
const zod_1 = require("zod");
exports.ProfileTypeSchema = zod_1.z.enum(['student', 'startup']);
exports.SignUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email().toLowerCase(),
    password: zod_1.z.string().min(8).max(128),
    profile_type: exports.ProfileTypeSchema,
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    bio: zod_1.z.string().max(1000).optional()
});
exports.SignInSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(10)
});
