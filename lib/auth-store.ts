import bcrypt from "bcryptjs";

export interface StoredUser {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

// In-memory user store (persists during server session).
// For production, replace with a database (Supabase, PostgreSQL, etc.)
const users = new Map<string, StoredUser>();

export async function createUser(email: string, name: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return { ok: false, error: "このメールアドレスは既に登録されています" };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(normalizedEmail, {
    email: normalizedEmail,
    name: name.trim() || normalizedEmail.split("@")[0],
    passwordHash,
    createdAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function verifyUser(email: string, password: string): Promise<{ ok: boolean; user?: { email: string; name: string }; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);
  if (!user) {
    return { ok: false, error: "メールアドレスまたはパスワードが正しくありません" };
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "メールアドレスまたはパスワードが正しくありません" };
  }
  return { ok: true, user: { email: user.email, name: user.name } };
}
