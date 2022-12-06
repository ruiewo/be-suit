import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

import { Menu, MenuItem, TextField } from '@mui/material';
import { Role } from '@prisma/client';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { BaseTable } from '../../components/table/baseTable';
import { client } from '../../models/apiClient';
import { ColumnDefinition, Details } from '../../models/equipment';
import { User } from '../../models/user';
import { sleep } from '../../modules/util';
import styles from '../../styles/multiSelectButton.module.css';

const Page: NextPage = () => {
  const [filterText, setFilterText] = useState('');
  const [roles, setRoles] = useState<Role[]>(['user']);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ users }] = await Promise.all([client.api.user.search.$post({ body: { roles: roles } }), sleep(1000)]);

        setUsers(users);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [roles]);

  const reload = () => setRoles([...roles]);

  if (isError) return <ErrorDialog />;

  if (users == null) return <ErrorDialog />;

  return (
    <>
      <UserSearchPanel filterText={filterText} setFilterText={setFilterText} roles={roles} setRoles={setRoles} />
      {isLoading ? <Loading /> : <UserTable users={users} filterText={filterText} reload={reload} />}
    </>
  );
};

export default Page;

type aProps = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
};

export const UserSearchPanel = ({ filterText, setFilterText, roles, setRoles }: aProps) => {
  const filter: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterText(e.target.value);
  };

  return (
    <div className={styles.selectPanel}>
      <RoleSelectButtons roles={roles} setRoles={setRoles} />
      <TextField margin="normal" label="絞り込み" value={filterText} onChange={filter} />
    </div>
  );
};

type cProps = {
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
};

export const RoleSelectButtons = ({ roles, setRoles }: cProps) => {
  const roleList: { role: Role; label: string }[] = [
    { role: 'guest', label: 'ゲスト' },
    { role: 'user', label: 'ユーザ' },
    { role: 'admin', label: '管理者' },
    { role: 'superAdmin', label: '特権管理者' },
  ];

  const onChange = (e: ChangeEvent<HTMLInputElement>, role: Role) => {
    if (e.target.checked) {
      setRoles([...roles, role]);
    } else {
      setRoles([...roles.filter(x => x !== role)]);
    }
  };

  return (
    <div className={styles.multiSelectButton}>
      {roleList.map(x => (
        <div key={x.role}>
          <input type="checkbox" checked={roles.includes(x.role)} onChange={e => onChange(e, x.role)} />
          <label>{x.label}</label>
        </div>
      ))}
    </div>
  );
};

type Props = {
  users: User[];
  filterText: string;
  reload: () => void;
};

const UserTable = ({ users, filterText, reload }: Props) => {
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

export const RoleContextMenu = ({ contextMenu, onClose }: ContextMenuProps) => {
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
