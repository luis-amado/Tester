import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";
import { db } from "~/server/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

export async function hashPassword(plaintextPassword: string) {
  try {
    const hashedPassword = await bcryptHash(plaintextPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch {
    return null;
  }
}

export async function verifyPassword(
  plaintextPassword: string,
  storedHash: string,
) {
  try {
    const isMatch = await bcryptCompare(plaintextPassword, storedHash);
    return isMatch;
  } catch {
    return null;
  }
}

export async function validateUserFromDb(username: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  if (!user) return null;

  const passwordVerified = await verifyPassword(password, user.password);
  if (!passwordVerified) return null;

  return {
    id: String(user.id),
    name: user.name,
    username: user.username,
  };
}
