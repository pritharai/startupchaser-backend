import { z } from "zod";

export const ProfileType = z.enum(["student", "startup"]);

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  profile_type: ProfileType,
  skills: z.array(z.string()).default([]),
  bio: z.string().max(1000).optional(),
  owned_startup_ids: z.array(z.string()).default([])
});

export const StartupSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  owner_uid: z.string()
});

export const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  fee: z.number().nonnegative().default(0),
  training_included: z.boolean().default(false),
  tasks: z.array(z.string()).default([]),
  startup_id: z.string(),
  startup_owner_uid: z.string()
});

export const ApplicationSchema = z.object({
  student_id: z.string(),
  startup_id: z.string(),
  project_id: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
  applied_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date())
});
