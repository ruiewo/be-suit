import { MouseEvent } from 'react';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

import { TextField } from '@mui/material';
import { Role } from '@prisma/client';

import { roleList } from '../../models/const/role';
import styles from '../../styles/multiSelectButton.module.css';

type Props = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
};

export const UserSearchPanel = ({ filterText, setFilterText, roles, setRoles }: Props) => {
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

type ButtonProps = {
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
};

const RoleSelectButtons = ({ roles, setRoles }: ButtonProps) => {
  const onClick = (e: MouseEvent<HTMLInputElement>, role: Role) => {
    e.preventDefault();

    if (e.button === 0) {
      setRoles([role]);
    } else if (e.button === 2) {
      if (e.currentTarget.checked) {
        setRoles([...roles.filter(x => x !== role)]);
      } else {
        setRoles([...roles, role]);
      }
    }
  };

  return (
    <div className={styles.multiSelectButton}>
      {roleList.map(x => (
        <div key={x.role}>
          <input
            type="checkbox"
            checked={roles.includes(x.role)}
            onClick={e => onClick(e, x.role)}
            onContextMenu={e => onClick(e, x.role)}
            readOnly
          />
          <label>{x.label}</label>
        </div>
      ))}
    </div>
  );
};
