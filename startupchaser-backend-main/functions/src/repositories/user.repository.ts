import {db} from "../config/firebase"; // Firestore instance
import {User, UserSchema} from "../models/user.model";

const usersCollection = "users";

export async function createUser(uid: string, data: unknown) {
  // Validate
  const parsed = UserSchema.parse(data);

  // Save in Firestore
  const userRef = db.collection(usersCollection).doc(uid);
  await userRef.set(parsed);

  return parsed;
}

export async function getUser(uid: string): Promise<User | null> {
  const userRef = db.collection(usersCollection).doc(uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) return null;
  return snapshot.data() as User;
}
