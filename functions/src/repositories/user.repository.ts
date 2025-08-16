import { db } from "../config/firebase"; // Firestore instance
import { User, UserSchema } from "../models/user.model";
import { doc, setDoc, getDoc } from "firebase/firestore";

const usersCollection = "users";

export async function createUser(uid: string, data: unknown) {
  // Validate
  const parsed = UserSchema.parse(data);

  // Save in Firestore
  const userRef = doc(db, usersCollection, uid);
  await setDoc(userRef, parsed);

  return parsed;
}

export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, usersCollection, uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;
  return snapshot.data() as User;
}
