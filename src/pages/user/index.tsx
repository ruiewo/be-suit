import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { BaseTable } from '../../components/table/baseTable';
import { client } from '../../models/apiClient';
import { ColumnDefinition, Details } from '../../models/equipment';
import { User } from '../../models/user';
import { sleep } from '../../modules/util';

const Page: NextPage = () => {
  const [filterText, setFilterText] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ users }] = await Promise.all([client.api.user.search.$get({ query: {} }), sleep(1000)]);

        setUsers(users);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  if (isError) return <ErrorDialog />;

  if (users == null) return <ErrorDialog />;

  return <>{isLoading ? <Loading /> : <UserTable users={users} filterText={filterText} />}</>;
};

export default Page;

type Props = {
  users: User[];
  filterText: string;
};

const UserTable = ({ users, filterText }: Props) => {
  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'id', type: 'string', label: 'ID', style: 'center', width: 120 },
    { key: 'name', type: 'string', label: 'Name', style: 'center', width: 120 },
    { key: 'email', type: 'string', label: 'Email', style: 'center', width: 150 },
    { key: 'role', type: 'string', label: 'Role', style: 'center', width: 80 },
  ];

  const tableData = users as Record<string, string | number>[];

  return <BaseTable data={tableData} columns={baseColumn} filterText={filterText} />;
};
