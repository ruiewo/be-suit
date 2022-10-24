import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { CategoryInput } from '../../components/categoryInput';
import { useCategories, useCategory } from '../../hooks/useCategories';
import { Category, CategoryBase } from '../../models/category';
import { ColumnDefinition, Details } from '../../models/equipment';

const initRootCategory: CategoryBase = {
  code: '',
  label: '',
  enable: true,
};
const iniSubCategories = [] as CategoryBase[];
const initColumns = [] as ColumnDefinition<Record<string, any>>[];

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const { categoryCode } = router.query;

  const { category, setCategory, isLoading, isError } = useCategory(categoryCode as string);

  // const [rootCategory, setRootCategory] = useState(initRootCategory);
  // const [subCategories, setSubCategories] = useState(iniSubCategories);
  // const [columns, setColumns] = useState(initColumns);

  // const [rootCategory, setRootCategory] = useState(category == null ? initRootCategory : category);
  // const [subCategories, setSubCategories] = useState(category == null ? iniSubCategories : category.subCategories);
  // const [columns, setColumns] = useState(category == null ? initColumns : category.columns);

  const [rootCategory, setRootCategory] = useState(initRootCategory);
  const onCategoryChange = (event: ChangeEvent) => {
    const c = { ...rootCategory };
    const target = event.target as HTMLInputElement;
    switch (target.name) {
      case 'code':
        c.code = target.value;
        break;
      case 'label':
        c.label = target.value;
        break;
      case 'enable':
        c.enable = target.checked;
        break;
      default:
        return;
    }

    setRootCategory(c);
  };

  const [subCategories, setSubCategories] = useState<CategoryBase[]>([{ code: '', label: '', enable: true }]);

  const onSubCategoryChange = (event: ChangeEvent, index?: number) => {
    if (index == null) {
      return;
    }

    const categories = [...subCategories];
    const c = categories[index];
    const target = event.target as HTMLInputElement;
    switch (target.name) {
      case 'code':
        c.code = target.value;
        break;
      case 'label':
        c.label = target.value;
        break;
      case 'enable':
        c.enable = target.checked;
        break;
      default:
        return;
    }

    setSubCategories(categories);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(subCategories);
  };

  const addSubCategory = () => {
    setSubCategories([...subCategories, { code: '', label: '', enable: true }]);
  };

  const removeSubCategory = (index: number) => {
    const categories = [...subCategories];
    categories.splice(index, 1);
    setSubCategories(categories);
  };

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  if (category == null) return <div>Category not found.</div>;

  // if (category != rootCategory) {
  //   setRootCategory(category);
  //   setSubCategories(category.subCategories);
  //   setColumns(category.columns);
  // }
  // setSubCategories(category.subCategories);
  // setColumns(category.columns);

  const handleSubmit = async () => {};

  // const update = () => setCategory({ ...category }, false);

  const updateRootCategory = (oldCategory: CategoryBase, newCategory: CategoryBase) => {
    // todo refactor as cast.
    // setRootCategory({ ...newCategory } as Category);
  };
  const updateSubCategory = (oldCategory: CategoryBase, newCategory: CategoryBase) => {
    const newCategories = subCategories.map(element => (element === oldCategory ? newCategory : oldCategory));
    // setSubCategories(newCategories);
  };

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
        <CategoryInput category={rootCategory} onChange={onCategoryChange}></CategoryInput>

        <hr />
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          SubCategory
        </Typography>
        {subCategories.map((subCategory, index) => (
          <CategoryInput key={index} index={index} category={subCategory} onChange={onSubCategoryChange} remove={removeSubCategory}></CategoryInput>
        ))}
        <Box sx={{ textAlign: 'center' }}>
          <Button type="button" onClick={addSubCategory}>
            ADD
          </Button>
        </Box>
        <hr />
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Column
        </Typography>
        {category.columns.map(ColumnInput)}
      </Box>
    </Box>
  );
};

export default CategoryPage;
