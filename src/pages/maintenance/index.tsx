import { NextPage } from 'next';

import { Loading } from '../../components/loading';
import { MenuArea } from '../../components/menu';
import { Skeleton } from '../../components/skeleton';
import { useCategories } from '../../hooks/useCategories';
import { page } from '../../models/const/path';

const MaintenancePage: NextPage = () => {
  const { categories, isLoading, isError } = useCategories('');

  if (isError) return <Skeleton />;

  if (isLoading) return <Loading />;

  if (categories == null) return <Skeleton />;

  const menu = [
    { title: '部署', description: '部署一覧を表示します', path: page.maintenanceDepartment, iconName: 'dev' },
    { title: '場所', description: '場所一覧を表示します', path: page.maintenanceLocation, iconName: 'dev' },
    { title: 'Category', description: 'カテゴリ一覧を表示します', path: page.category, iconName: 'dev' },
    { title: 'ユーザ', description: 'ユーザ一覧を表示します', path: page.user, iconName: 'users' },
  ];

  return (
    <div style={{ width: '350px', backgroundColor: 'var(--color-dark-gray)' }}>
      <MenuArea header="管理者用" menuList={menu}></MenuArea>
    </div>
  );
};

export default MaintenancePage;
