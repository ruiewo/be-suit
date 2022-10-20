import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Category, SubCategory } from '../../models/category';
import { ColumnDefinition, Details } from '../../models/equipment';

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const { categoryCode } = router.query;

  const { categories, setCategories, isLoading, isError } = useCategories(categoryCode as string);

  // const [category, setCategory] = useState(categories ? categories[0] : null);
  // console.log(`!!!category: ${category}`);

  console.log(`isError: ${isError}`);
  if (isError) return <div>Failed to load</div>;

  console.log(`isLoading: ${isLoading}`);
  if (isLoading) return <div>Loading...</div>;

  console.log(`categories: ${JSON.stringify(categories)}`);
  if (categories == null || categories.length !== 1) return <div>Category not found.</div>;

  // setCategory(categories[0]);
  // if (category == null) return <div>Category not found.</div>;

  const category = categories[0];
  console.log(`???categories: ${JSON.stringify(category)}`);
  const handleSubmit = async () => {};
  console.log(category);

  const subCategories = (category.subCategories ?? []) as SubCategory[];

  const CategoryInput = (subCategory: SubCategory) => (
    <>
      <TextField margin="normal" sx={{ width: '29%', ml: '2%', mr: '2%' }} label="code" name="code" defaultValue={subCategory.code} />
      <TextField
        margin="normal"
        sx={{ width: '29%', ml: '2%', mr: '2%' }}
        label="label"
        name="label"
        value={subCategory.label}
        onChange={e => {
          subCategory.label = e.target.value;
          console.log(subCategory);
          console.dir(categories);
          // @ts-ignore
          console.log(categories[0].subCategories[0]);
          setCategories({ categories }, { revalidate: false });
        }}
      />
      <FormControlLabel control={<Checkbox checked={subCategory.enable} />} label="Enabled" />
    </>
  );

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
        {CategoryInput(category)}
        <hr />
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          SubCategory
        </Typography>
        {subCategories.map(CategoryInput)}
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
