import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  const hash = await bcrypt.hash(password, Number(salt));
  return hash;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
