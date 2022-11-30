import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';

import aspida from '@aspida/fetch';
import { Box, Button, Typography } from '@mui/material';

import { CategoryInput } from '../../components/categoryInput';
import { ColumnInput } from '../../components/columnInput';
import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { useCategory } from '../../hooks/useCategories';
import { Category, CategoryBase } from '../../models/category';
import { ColumnDefinition, Details, ValueType } from '../../models/equipment';
import api from '../../pages/$api';

const client = api(aspida());

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const { categoryCode } = router.query;

  const { category, isLoading, isError } = useCategory(categoryCode as string, c => {
    setRootCategory(c);
    setSubCategories(c.subCategories);
    setColumns(c.columns);
  });

  const [rootCategory, setRootCategory] = useState(category ?? { code: '', label: '', enable: true });
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

  const [subCategories, setSubCategories] = useState<CategoryBase[]>(category?.subCategories ?? [{ code: '', label: '', enable: true }]);

  const onSubCategoryChange = (event: ChangeEvent, index?: number) => {
    if (index == null) {
      return;
    }

    const categories = [...subCategories];
    const c = categories[index];
    const target = event.target as HTMLInputElement;
    const newSubCategory = { ...c };
    switch (target.name) {
      case 'code':
        newSubCategory.code = target.value;
        break;
      case 'label':
        newSubCategory.label = target.value;
        break;
      case 'enable':
        newSubCategory.enable = target.checked;
        break;
      default:
        return;
    }

    categories.splice(index, 1, newSubCategory);

    setSubCategories(categories);
  };

  const addSubCategory = () => {
    setSubCategories([...subCategories, { code: '', label: '', enable: true }]);
  };

  const removeSubCategory = (index: number) => {
    const categories = [...subCategories];
    categories.splice(index, 1);
    setSubCategories(categories);
  };

  const [columns, setColumns] = useState<ColumnDefinition<Details>[]>(category?.columns ?? []);

  const onColumnChange = (event: ChangeEvent, index?: number) => {
    if (index == null) {
      return;
    }

    const newColumns = [...columns];
    const c = newColumns[index];
    const target = event.target as HTMLInputElement;
    const newColumn = { ...c };
    switch (target.name) {
      case 'key':
        newColumn.key = target.value;
        break;
      case 'type':
        newColumn.type = target.value as ValueType;
        break;
      case 'label':
        newColumn.label = target.value;
        break;
      case 'width':
        newColumn.width = Number(target.value);
        break;
      default:
        return;
    }

    newColumns.splice(index, 1, newColumn);
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { key: 'key', type: 'string', label: 'label', width: 120 }]);
  };

  const removeColumn = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(rootCategory);
  };

  const update = () => {
    const newCategory: Category = { ...rootCategory, subCategories, columns };
    client.api.category.update.$post({ body: { category: newCategory } });
  };

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (rootCategory == null) return <div>Category not found.</div>;

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          Category: {rootCategory.code}
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
        {columns.map((column, index) => (
          <ColumnInput key={index} index={index} column={column} onChange={onColumnChange} remove={removeColumn}></ColumnInput>
        ))}
        <Box sx={{ textAlign: 'center' }}>
          <Button type="button" onClick={addColumn}>
            ADD
          </Button>
        </Box>
        <hr />
        <Box sx={{ textAlign: 'center' }}>
          <Button
            disabled={false}
            variant="contained"
            color="secondary"
            sx={{ width: 200 }}
            onClick={() => {
              // onClose();
            }}
          >
            キャンセル
          </Button>
          <Button disabled={false} variant="contained" color="primary" sx={{ width: 200 }} onClick={update}>
            確定
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryPage;
