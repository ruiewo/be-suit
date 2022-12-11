import { Role } from '@prisma/client';

export const role = {
  guest: 'guest',
  user: 'user',
  manager: 'manager',
  admin: 'admin',
  superAdmin: 'superAdmin',
} as const;

export const roles = Object.values(role);

export const roleList: { role: Role; label: string }[] = [
  { role: role.guest, label: 'ゲスト' },
  { role: role.user, label: 'ユーザ' },
  { role: role.manager, label: '部門管理者' },
  { role: role.admin, label: '管理者' },
  { role: role.superAdmin, label: '特権管理者' },
];
