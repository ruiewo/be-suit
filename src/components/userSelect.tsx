import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { client } from '../models/apiClient';
import { UserModel } from '../models/user';

type Props = {
  name: string;
  label: string;
  user: UserModel | null;
  onChange: (user: UserModel | null) => void;
};
export default function UserSelect({ name, label, user: initialUser, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<UserModel | null>(initialUser);
  const [users, setUsers] = useState<readonly UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let isActive = true;

    setTimeout(async () => {
      if (!isActive) {
        return;
      }

      if (inputValue === '') {
        setUsers(user ? [user] : []);
        setIsLoading(false);
      } else {
        const { users } = await client.api.user.search.$post({ body: { text: inputValue, limit: 10 } });
        setUsers(users);
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      isActive = false;
    };
  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      setUsers([]);
    }
  }, [open]);

  return (
    <Autocomplete
      sx={{ width: 300, display: 'inline-block' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event: any, newValue: UserModel | null) => {
        setUsers(newValue ? [newValue, ...users] : users);
        setUser(newValue);
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      value={user}
      filterOptions={x => x}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name!}
      options={users}
      loading={isLoading}
      renderInput={params => (
        <TextField
          {...params}
          name={name}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
