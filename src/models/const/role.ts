export const role = {
  guest: 'guest',
  user: 'user',
  admin: 'admin',
  superAdmin: 'superAdmin',
} as const;

export const roles = Object.values(role);
