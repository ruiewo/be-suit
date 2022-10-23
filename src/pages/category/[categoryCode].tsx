import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CategoryInput } from '../../components/categoryInput';
import { useCategories, useCategory } from '../../hooks/useCategories';
import { Category, CategoryBase } from '../../models/category';
import { ColumnDefinition, Details } from '../../models/equipment';

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const { categoryCode } = router.query;

  const { category, setCategory, isLoading, isError } = useCategory(categoryCode as string);

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  if (category == null) return <div>Category not found.</div>;

  const handleSubmit = async () => {};

  const update = () => setCategory({ ...category }, false);
  // const update = () => setCategory({ ...category }, false);

  const updateSubCategory = (subCategory: CategoryBase) => {
    setCategory({ ...category }, false);
  };

  const subCategories = (category.subCategories ?? []) as CategoryBase[];

  const columns = (category.columns ?? []) as ColumnDefinition<Record<string, any>>[];

  const ColumnInput = (column: Details) => (
    <>
      <TextField margin="normal" sx={{ width: '20%', ml: '2%', mr: '2%' }} label="key" name="key" defaultValue={column.key} />
      <TextField margin="normal" sx={{ width: '20%', ml: '2%', mr: '2%' }} label="type" name="type" defaultValue={column.type} />
      <TextField margin="normal" sx={{ width: '20%', ml: '2%', mr: '2%' }} label="label" name="label" defaultValue={column.label} />
      <TextField margin="normal" sx={{ width: '20%', ml: '2%', mr: '2%' }} label="width" name="width" defaultValue={column.width} />
    </>
  );

  return (
    <Box>
      <Box id="categoryForm" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          Category: {category.code}
        </Typography>
        <CategoryInput category={category} update={update} update={update} setCategory={setCategory}></CategoryInput>

        <hr />
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          SubCategory
        </Typography>
        {subCategories.map(subCategory => (
          <CategoryInput key={subCategory.code} category={subCategory} update={update}></CategoryInput>
        ))}
        <hr />
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Column
        </Typography>
        {columns.map(ColumnInput)}
      </Box>
    </Box>
  );
};

export default CategoryPage;
