import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';

import { EditButton } from '../../components/button/editButton';
import { Loading } from '../../components/loading';
import { Skeleton } from '../../components/skeleton';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../models/category';
import { page } from '../../models/const/path';
import styles from '../../styles/categoryList.module.css';
import styles2 from '../../styles/multiSelectButton.module.css';

const CategoryPage: NextPage = () => {
  const { categories, isLoading, isError } = useCategories('');

  if (isError) return <Skeleton />;

  if (isLoading) return <Loading />;

  if (categories == null) return <Skeleton />;

  return <CategoryList categories={categories}></CategoryList>;
};

export default CategoryPage;

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <Box component="ul">
      {categories.map(category => (
        <ListItem key={category.code} category={category}></ListItem>
      ))}
    </Box>
  );
}

function ListItem({ category }: { category: Category }) {
  const router = useRouter();

  return (
    <Box component="li" sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className={styles.mainLabel}>{category.label}</span>
      <div className={styles2.multiSelectButton}>
        {category.subCategories.map(x => (
          <div key={x.code}>
            <input type="checkbox" checked={false} onClick={() => router.push(`${page.equipment}/${category.code}/${x.code}`)} readOnly />
            <label>{x.label}</label>
          </div>
        ))}
      </div>
      <Link href={`${page.category}/${category.code}`}>
        <EditButton></EditButton>
      </Link>
    </Box>
  );
}
