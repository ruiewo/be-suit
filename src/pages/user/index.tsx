import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Role } from '@prisma/client';

import { Loading } from '../../components/loading';
import { UserSearchPanel } from '../../components/searchPanel/userSearchPanel';
import { Skeleton } from '../../components/skeleton';
import { UserTable } from '../../components/table/userTable';
import { client } from '../../models/apiClient';
import { UserModel } from '../../models/user';
import { sleep } from '../../modules/util';

const Page: NextPage = () => {
  const [filterText, setFilterText] = useState('');
  const [roles, setRoles] = useState<Role[]>(['user']);

  const [users, setUsers] = useState<UserModel[]>([]);
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

  if (isError) return <Skeleton />;

  if (users == null) return <Skeleton />;

  return (
    <>
      <UserSearchPanel filterText={filterText} setFilterText={setFilterText} roles={roles} setRoles={setRoles} />
      {isLoading ? <Loading /> : <UserTable users={users} filterText={filterText} reload={reload} />}
    </>
  );
};

export default Page;
