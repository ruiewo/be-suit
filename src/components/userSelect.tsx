import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { client } from '../models/apiClient';
import { UserModel } from '../models/user';
import { sleep } from '../modules/util';

export default function UserSelect() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<UserModel | null>(null);
  const [users, setUsers] = useState<readonly UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    if (inputValue === '') {
      setUsers(user ? [user] : []);
      setIsLoading(false);
      return undefined;
    }

    (async () => {
      await sleep(500);
      const { users } = await client.api.user.search.$post({ body: { text: inputValue, limit: 10 } });

      if (active) {
        setUsers(users);
      }
      setIsLoading(false);
    })();

    return () => {
      active = false;
      setIsLoading(false);
    };
  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      setUsers([]);
    }
  }, [open]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
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
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      filterOptions={x => x}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name!}
      options={users}
      loading={isLoading}
      renderInput={params => (
        <TextField
          {...params}
          label="RentUser"
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
