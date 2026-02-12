import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

const adminRecord = {
  id: 'admin-1',
  username: env.adminUsername,
  passwordHash: bcrypt.hashSync(env.adminPassword, 10),
};

export const authenticateAdmin = async ({ username, password }) => {
  if (username !== adminRecord.username) {
    return null;
  }

  const isValid = await bcrypt.compare(password, adminRecord.passwordHash);
  if (!isValid) {
    return null;
  }

  return { id: adminRecord.id, username: adminRecord.username };
};
