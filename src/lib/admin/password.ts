import crypto from "node:crypto";

/**
 * Admin password hashes in the "scrypt:32768:8:1$<salt>$<hex>" format already
 * stored in the admin database, so existing logins keep working. Older
 * "pbkdf2:<digest>:<iterations>$..." hashes are accepted too.
 */
const SALT_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const N = 32768;
const R = 8;
const P = 1;

function scrypt(password: string, salt: string, n: number, r: number, p: number, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, keylen, { N: n, r, p, maxmem: 132 * n * r * p }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

function makeSalt(): string {
  return Array.from(crypto.randomBytes(16), (b) => SALT_CHARS[b % SALT_CHARS.length]).join("");
}

export async function generatePasswordHash(password: string): Promise<string> {
  const salt = makeSalt();
  const key = await scrypt(password, salt, N, R, P, 64);
  return `scrypt:${N}:${R}:${P}$${salt}$${key.toString("hex")}`;
}

/** Synchronous variant for first-run seeding. */
export function generatePasswordHashSync(password: string): string {
  const salt = makeSalt();
  const key = crypto.scryptSync(password, salt, 64, { N, r: R, p: P, maxmem: 132 * N * R * P });
  return `scrypt:${N}:${R}:${P}$${salt}$${key.toString("hex")}`;
}

export async function checkPasswordHash(stored: string, password: string): Promise<boolean> {
  const [method, salt, hex] = stored.split("$");
  if (!method || !salt || !hex) return false;
  const expected = Buffer.from(hex, "hex");
  const [kind, ...args] = method.split(":");

  let actual: Buffer;
  if (kind === "scrypt") {
    const [n = N, r = R, p = P] = args.map(Number);
    actual = await scrypt(password, salt, n, r, p, expected.length);
  } else if (kind === "pbkdf2") {
    const [digest = "sha256", iterations = "600000"] = args;
    actual = crypto.pbkdf2Sync(password, salt, Number(iterations), expected.length, digest);
  } else {
    return false;
  }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
