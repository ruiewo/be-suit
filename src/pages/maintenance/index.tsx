import { NextPage } from 'next';

import { Box } from '@mui/material';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { MenuItem } from '../../components/menu';
import { useCategories } from '../../hooks/useCategories';
import { page } from '../../models/const/path';

const MaintenancePage: NextPage = () => {
  const { categories, isLoading, isError } = useCategories('');

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (categories == null) return <ErrorDialog />;

  const menu = [
    { title: '部署', description: '部署一覧を表示します', path: page.maintenanceDepartment, src: '/images/computer.svg' },
    { title: '場所', description: '場所一覧を表示します', path: page.maintenanceLocation, src: '/images/monitor.svg' },
    { title: 'Category', description: 'カテゴリ一覧を表示します', path: page.category, src: '/images/dev.svg' },
    { title: 'ユーザ', description: 'ユーザ一覧を表示します', path: page.user, src: '/images/user.svg' },
  ];

  return (
    <Box component="ul">
      {menu.map(menu => (
        <MenuItem key={menu.title} {...menu}></MenuItem>
      ))}
    </Box>
  );
};

export default MaintenancePage;
