import {z} from "zod";

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  profile_type: z.enum(["student", "startup"]),
  skills: z.array(z.string()).default([]),
  bio: z.string().max(1000).optional(),
  owned_startup_ids: z.array(z.string()).default([]),
});

export type User = z.infer<typeof UserSchema>;

// 👇 Add default export
export default UserSchema;
