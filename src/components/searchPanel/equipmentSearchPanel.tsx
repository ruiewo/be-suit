import ExcelJS from 'exceljs';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { MouseEvent } from 'react';

import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useCategories } from '../../hooks/useCategories';
import { client } from '../../models/apiClient';
import { Category, CategoryBase } from '../../models/category';
import { DepartmentModel } from '../../models/departmentModel';
import { ColumnDefinition, Details, convertToDisplay } from '../../models/equipmentModel';
import { style } from '../../modules/excel';
import { DateEx, isNullOrWhiteSpace } from '../../modules/util';
import { CategoryCodes } from '../../pages/api/equipment/advancedSearch';
import styles from '../../styles/multiSelectButton.module.css';
import { ExportButton } from '../button/exportButton';
import { Loading } from '../loading';
import { TableDataObj } from '../table/baseTable';

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

  const baseColumns: ColumnDefinition<Details>[] = [
    { key: 'rentalButtonState', type: 'string', label: '貸出状態', style: 'center', width: 80 },
    { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
    { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUserStr', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
    { key: 'registrationDate', type: 'date', label: '登録日', style: 'center', width: 120 },
    { key: 'note', type: 'string', label: '備考', width: 400 },
  ];

  const handlerClickDownExportButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (allCategories == null) return;

    const workbook = new ExcelJS.Workbook();

    const targetCategories = departmentId == null ? allCategories.filter(x => x.code === categoryCodes.main) : allCategories;

    for (const category of targetCategories) {
      const subCategories = allCategories.find(x => x.code === category.code)?.subCategories ?? [];
      const subCategoryCodes = subCategories.map(x => x.code);

      const { equipments, columns } = await client.api.equipment.advancedSearch.$post({
        body: { categoryCodes: { main: category.code, sub: subCategoryCodes }, departmentId },
      });

      if (equipments.length === 0) {
        continue;
      }

      const tableData = equipments.map(equipment => {
        const converted: TableDataObj = {};
        converted['id'] = equipment.id;

        for (const col of baseColumns) {
          if (col.key === 'rentalButtonState') {
            let stateLabel = '';
            switch (equipment[col.key]?.toString()) {
              case 'canRent':
                stateLabel = '貸出可能';
                break;
              case 'lending':
                stateLabel = '貸出中';
                break;
              case 'canReturn':
                stateLabel = '返却可能';
                break;
              case 'deleted':
                stateLabel = '廃棄';
                break;
              default:
                break;
            }

            converted[col.key] = stateLabel;
          } else {
            converted[col.key] = convertToDisplay(equipment, col.key, col.type);
          }
        }

        for (const col of columns) {
          converted[col.key] = convertToDisplay(equipment.details, col.key, col.type);
        }

        return converted;
      });

      const allColumns = [...baseColumns, ...columns];
      if (category.code === 'PC') {
        const pcNameIndex = allColumns.findIndex(x => x.key === 'pcName');
        const pcNameColumn = allColumns.splice(pcNameIndex, 1)[0];

        const codeIndex = allColumns.findIndex(x => x.key === 'code');
        allColumns.splice(codeIndex + 1, 0, pcNameColumn);
      }

      const worksheetColumns = allColumns.map(x => {
        let width = 15;
        switch (x.key) {
          case 'rentalUserStr':
            width = 20;
            break;
          case 'modelNumber':
          case 'department':
            width = 25;
            break;
          case 'note':
            width = 30;
            break;
          default:
        }
        return { header: x.label, key: x.key, width: width };
      });

      workbook.addWorksheet(category.label);
      const worksheet = workbook.getWorksheet(category.label);
      worksheet.columns = worksheetColumns;
      worksheet.addRows(tableData);
      worksheet.autoFilter = {
        from: {
          row: 1,
          column: 1,
        },
        to: {
          row: 1,
          column: allColumns.length,
        },
      };

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          if (rowNumber === 1) {
            cell.fill = style.fill.header;
            cell.font = style.font.header;
          } else {
            cell.fill = rowNumber % 2 === 0 ? style.fill.even : style.fill.odd;
          }
          cell.border = style.border;
          cell.alignment = { wrapText: true, horizontal: 'left', vertical: 'middle' };
        });

        row.commit();
      });
    }

    // department.label or Main CategoryCode
    // If departmentId is null, CategoryCode will be used.
    const subTitle = departments.find(x => x.id === departmentId)?.label ?? categoryCodes.main;

    const yyyymmdd = new DateEx().toDateString().replace('-', '');
    const fileName = `機器一覧_${subTitle}_${yyyymmdd}.xlsx`;

    const uint8Array = await workbook.xlsx.writeBuffer();
    download(fileName, new Blob([uint8Array], { type: 'application/octet-binary' }));
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
      <TextField margin="normal" label="絞り込み" value={filterText} onChange={filter} />
      <ExportButton onClick={handlerClickDownExportButton} />
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

function download(fileName: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
}
