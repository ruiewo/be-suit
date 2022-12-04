import { NextPage } from 'next';
import Link from 'next/link';

import { Box, Typography } from '@mui/material';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { EditButton } from '../../components/editButton';
import { Loading } from '../../components/loading';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../models/category';
import { page } from '../../models/const/path';
import styles from '../../styles/categoryList.module.css';

const CategoryPage: NextPage = () => {
  const { categories, isLoading, isError } = useCategories('');

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (categories == null) return <ErrorDialog />;

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
  return (
    <Box component="li" sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography className={styles.mainLabel} fontWeight="bold">
        {category.label}
      </Typography>
      {category.subCategories.map(x => (
        <Link key={x.code} href={`${page.equipment}/${category.code}/${x.code}`}>
          <span className={styles.subLabel}> {x.label}</span>
        </Link>
      ))}
      <Link href={`${page.category}/${category.code}`}>
        <EditButton></EditButton>
      </Link>
    </Box>
  );
}
