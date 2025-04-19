import * as bcrypt from 'bcrypt';

export async function doHashing(message: string): Promise<string> {
  return bcrypt.hash(message, 10);
}

export async function compareHash(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}
