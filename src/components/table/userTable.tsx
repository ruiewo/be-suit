import { Menu, MenuItem } from '@mui/material';
import { Role } from '@prisma/client';

import { client } from '../../models/apiClient';
import { ColumnDefinition, Details } from '../../models/equipment';
import { User } from '../../models/user';
import { BaseTable } from './baseTable';

type Props = {
  users: User[];
  filterText: string;
  reload: () => void;
};

export const UserTable = ({ users, filterText, reload }: Props) => {
  const columns: ColumnDefinition<Details>[] = [
    { key: 'id', type: 'string', label: 'ID', style: 'center', width: 120 },
    { key: 'name', type: 'string', label: 'Name', style: 'center', width: 120 },
    { key: 'email', type: 'string', label: 'Email', style: 'center', width: 150 },
    { key: 'role', type: 'string', label: 'Role', style: 'center', width: 80 },
  ];

  const tableData = users as Record<string, string | number>[];

  return <BaseTable data={tableData} columns={columns} filterText={filterText} reload={reload} ContextMenu={RoleContextMenu} />;
};

export type ContextMenu = { mouseX: number; mouseY: number; dataId: string } | null;
export type ContextMenuProps = {
  contextMenu: ContextMenu;
  onClose: (isEdited: boolean) => void;
};

const RoleContextMenu = ({ contextMenu, onClose }: ContextMenuProps) => {
  const roleList: { role: Role; label: string }[] = [
    { role: 'guest', label: 'ゲスト' },
    { role: 'user', label: 'ユーザ' },
    { role: 'admin', label: '管理者' },
    { role: 'superAdmin', label: '特権管理者' },
  ];

  const handleClick = async (role: Role) => {
    // todo error handling
    const { succeed } = await client.api.user.update.$post({ body: { userId: contextMenu!.dataId, role } });
    onClose(succeed);
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={() => onClose(false)}
      anchorReference="anchorPosition"
      anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
    >
      {roleList.map(x => (
        <MenuItem key={x.role} onClick={() => handleClick(x.role)}>
          {x.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
