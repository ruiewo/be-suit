import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { MouseEvent } from 'react';

import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useCategories } from '../../hooks/useCategories';
import { Category, CategoryBase } from '../../models/category';
import { DepartmentModel } from '../../models/departmentModel';
import { isNullOrWhiteSpace } from '../../modules/util';
import { CategoryCodes } from '../../pages/api/equipment/advancedSearch';
import styles from '../../styles/multiSelectButton.module.css';
import { Loading } from '../loading';

type Props = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  categoryCodes: CategoryCodes;
  setCategoryCodes: Dispatch<SetStateAction<CategoryCodes>>;
  departments: DepartmentModel[];
  departmentId: number | undefined;
  setDepartmentId: Dispatch<SetStateAction<number | undefined>>;
};

export const EquipmentSearchPanel = ({
  filterText,
  setFilterText,
  categoryCodes,
  setCategoryCodes,
  departments,
  departmentId,
  setDepartmentId,
}: Props) => {
  const { categories: allCategories, isLoading, isError } = useCategories('');

  const filter: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterText(e.target.value);
  };

  if (allCategories == null) {
    return <Loading></Loading>;
  }

  const subCategories = allCategories.find(x => x.code === categoryCodes.main)?.subCategories ?? [];

  const onMainCategoryChange = (code: string) => {
    const newCategory = allCategories.find(x => x.code === code);
    if (newCategory == null) {
      return;
    }

    setCategoryCodes({ main: newCategory.code, sub: [newCategory.subCategories[0].code] });
  };

  const onDepartmentChange = (idStr: string) => {
    const id = isNullOrWhiteSpace(idStr) ? undefined : parseInt(idStr);
    setDepartmentId(id);
  };

  return (
    <div className={styles.selectPanel}>
      {departmentId == null ? (
        <></>
      ) : (
        <DepartmentSelect departments={departments} value={departmentId} onChange={onDepartmentChange}></DepartmentSelect>
      )}
      <MainCategorySelect categories={allCategories} value={categoryCodes.main} onChange={onMainCategoryChange}></MainCategorySelect>
      <SubCategoryButtons categoryCodes={categoryCodes} subCategories={subCategories} setCategoryCodes={setCategoryCodes} />
      <TextField margin="normal" label="????????????" value={filterText} onChange={filter} />
    </div>
  );
};

type DepartmentSelectProps = {
  departments: DepartmentModel[];
  value: number | undefined;
  onChange: (id: string) => void;
};

function DepartmentSelect({ departments, value, onChange }: DepartmentSelectProps) {
  return (
    <Box sx={{ width: 200 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Department</InputLabel>
        <Select label="Department" name="type" value={value} onChange={e => onChange(e.target.value as string)}>
          {departments.map(x => (
            <MenuItem key={x.id} value={x.id}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

type SelectProps = {
  categories: Category[];
  value: string;
  onChange: (categoryCode: string) => void;
};

function MainCategorySelect({ categories, value, onChange }: SelectProps) {
  return (
    <Box sx={{ width: 200 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="mainCategorySelectLabel">Category</InputLabel>
        <Select labelId="mainCategorySelectLabel" label="Category" name="type" value={value} onChange={e => onChange(e.target.value)}>
          {categories.map(x => (
            <MenuItem key={x.code} value={x.code}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

type ButtonProps = {
  categoryCodes: CategoryCodes;
  subCategories: CategoryBase[];
  setCategoryCodes: Dispatch<SetStateAction<CategoryCodes>>;
};

const SubCategoryButtons = ({ categoryCodes, subCategories, setCategoryCodes }: ButtonProps) => {
  const onClick = (e: MouseEvent<HTMLInputElement>, subCategoryCode: string) => {
    e.preventDefault();

    if (e.button === 0) {
      setCategoryCodes({ main: categoryCodes.main, sub: [subCategoryCode] });
    } else if (e.button === 2) {
      if (e.currentTarget.checked) {
        setCategoryCodes({ main: categoryCodes.main, sub: [...categoryCodes.sub.filter(x => x !== subCategoryCode)] });
      } else {
        setCategoryCodes({ main: categoryCodes.main, sub: [...categoryCodes.sub, subCategoryCode] });
      }
    }
  };

  return (
    <div className={styles.multiSelectButton}>
      {subCategories.map(x => (
        <div key={x.code}>
          <input
            type="checkbox"
            checked={categoryCodes.sub.includes(x.code)}
            onClick={e => onClick(e, x.code)}
            onContextMenu={e => onClick(e, x.code)}
            readOnly
          />
          <label>{x.label}</label>
        </div>
      ))}
    </div>
  );
};
