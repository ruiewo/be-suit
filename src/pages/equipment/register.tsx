import { NextPage } from 'next';
import React, { ChangeEvent, useState } from 'react';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { useCategories } from '../../hooks/useCategories';
import { CategoryBase } from '../../models/category';
import { Equipment } from '../../models/equipment';
import styles from '../../styles/registerForm.module.css';

const RegisterPage: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const equipmentBaseColumn = [
    { key: 'id', type: 'number', label: 'ID', width: 40, isRegistrable: false },
    { key: 'category', type: 'string', label: 'メインカテゴリー', width: 100, isRegistrable: false },
    { key: 'subCategory', type: 'string', label: 'サブカテゴリー', width: 100, isRegistrable: false },
    { key: 'categorySerial', type: 'number', label: '管理番号', width: 100, isRegistrable: true },
    { key: 'maker', type: 'string', label: 'メーカー', width: 120, isRegistrable: true },
    { key: 'modelNumber', type: 'string', label: '型番', width: 120, isRegistrable: true },
    { key: 'group', type: 'string', label: '管理者', width: 120, isRegistrable: false },
    { key: 'rentalUserStr', type: 'string', label: '使用者', width: 120, isRegistrable: false },
    { key: 'place', type: 'string', label: '使用・保管場所', width: 180, isRegistrable: false },
    { key: 'rentalDate', type: 'date', label: '貸出日', width: 120, isRegistrable: false },
    { key: 'returnDate', type: 'date', label: '返却日', width: 120, isRegistrable: false },
    { key: 'registrationDate', type: 'date', label: '登録日', width: 120, isRegistrable: false },
    { key: 'deletedDate', type: 'date', label: '削除日', width: 120, isRegistrable: false },
    { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120, isRegistrable: false },
    { key: 'note', type: 'string', label: '備考', width: 400, isRegistrable: true },
  ];

  const { categories, isLoading, isError } = useCategories('');
  const [selectableSubCategories, setSelectableSubCategories] = useState<CategoryBase[]>([]);
  const [formEquipment, setFormEquipment] = useState({ category: '', subCategory: '', maker: '', modelNumber: '', note: '' } as Equipment);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const onTextChange = (event: ChangeEvent) => {
    const e = { ...formEquipment };
    const target = event.target as HTMLInputElement;
    switch (target.name) {
      case 'category':
        {
          const categoryName = target.value;
          e.category = categoryName.substring(0, categoryName.indexOf('_'));

          if (categories != null) {
            let subCategories = [...selectableSubCategories];
            categories.map(category => {
              if (category.code == e.category) {
                subCategories = category.subCategories;
              }
            });
            setSelectableSubCategories(subCategories);
          }
        }
        break;
      case 'subCategory':
        {
          const subCategoryName = target.value;
          e.subCategory = subCategoryName.substring(0, subCategoryName.indexOf('_'));
        }
        break;
      case 'maker':
        e.maker = target.value;
        break;
      case 'modelNumber':
        e.modelNumber = target.value;
        break;
      case 'note':
        e.note = target.value;
        break;
      default:
        return;
    }
    setFormEquipment(e);
  };

  const addEquipment = async () => {
    console.log(categories);
    if (formEquipment.category == '' || formEquipment.subCategory == '') {
      setErrorMessage('カテゴリーを選択してください。');
      return;
    }
    if (formEquipment.category == 'パソコン' && (formEquipment.maker == '' || formEquipment.modelNumber == '')) {
      setErrorMessage('メーカー・型番を入力してください。');
      return;
    }

    const newEquipments = [...equipments];
    newEquipments.push(formEquipment);
    setEquipments(newEquipments);
    setEquipments([...equipments, formEquipment]);

    const e = { ...formEquipment };
    e.maker = '';
    e.modelNumber = '';
    e.note = '';
    setFormEquipment(e);
  };

  const registerEquipments = async () => {
    // TODO：DBへの登録（以下参考）
    // const newEquipments = { ...equipments };
    //  const equipmentData = {} as Equipment;
    // equipmentBaseColumn.forEach(x => {
    //   equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
    // });
    // const details = {} as Details;
    // optionColumn.forEach(col => {
    //   details[col.key] = convertToValue(data.get(col.key), col.type);
    // });
    // equipmentData.details = details;
    // const { error } = await client.api.category.update.$post({ body: { equipment: equipmentData } });
    // if (error) {
    //   const message = error.errors.reduce((prev, current) => prev + '\n' + current.message, '');
    //   setErrorMessage(message);
    // }
  };

  if (isError || errorMessage) return <ErrorDialog message={errorMessage} />;

  if (isLoading) return <Loading />;

  if (categories == null) return <ErrorDialog />;

  return (
    <div className={styles.registerPage}>
      <div className={styles.top}>
        <div className={styles.registerForm}>
          <div className={styles.form}>
            <div className={styles.area}>
              <div className={styles.areaIcon}>
                <span className={`icon-master`}></span>
                <span className={styles.iconTitle}>管理番号</span>
              </div>
              <div className={styles.controlNumber}>
                <label>メインカテゴリー</label>
                <select name="category" className={styles.select} onChange={onTextChange}>
                  <option>--- メインカテゴリーを選択 ---</option>
                  {categories.map((category, index) => {
                    return (
                      <option key={index} title={category.code}>
                        {category.code}_{category.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={styles.controlNumber}>
                <label>サブカテゴリー</label>
                <select name="subCategory" className={styles.select} onChange={onTextChange}>
                  <option>--- サブカテゴリーを選択 ---</option>
                  {selectableSubCategories.map((subCategory, index) => {
                    return (
                      <option key={index} title={subCategory.code}>
                        {subCategory.code}_{subCategory.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className={styles.area}>
              <div className={styles.areaIcon}>
                <span className={`icon-computer`}></span>
                <span className={styles.iconTitle}>PC情報</span>
              </div>
              {equipmentBaseColumn.map(column => {
                if (column.key == 'maker') {
                  return (
                    <div className={styles.category} key={column.key}>
                      <label>{column.label}</label>
                      <input
                        value={formEquipment.maker}
                        name={column.key}
                        key={column.key}
                        placeholder={column.label}
                        type={column.type}
                        onChange={onTextChange}
                      />
                    </div>
                  );
                }
                if (column.key == 'modelNumber') {
                  return (
                    <div className={styles.category} key={column.key}>
                      <label>{column.label}</label>
                      <input
                        value={formEquipment.modelNumber}
                        name={column.key}
                        key={column.key}
                        placeholder={column.label}
                        type={column.type}
                        onChange={onTextChange}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className={styles.area}>
              <div className={styles.areaIcon}>
                <span className={`icon-setting`}></span>
                <span className={styles.iconTitle}>その他</span>
              </div>
              {equipmentBaseColumn.map(column => {
                if (column.key == 'note') {
                  return (
                    <div className={styles.category} key={column.key}>
                      <label>{column.label}</label>
                      <textarea value={formEquipment.note} name={column.key} placeholder={column.label} onChange={onTextChange}></textarea>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className={styles.formButton}>
            <div className={styles.buttonArea}>
              <button className={`${styles.add} ${styles.button}`} onClick={addEquipment}>
                <span>下に追加</span>
              </button>
              <button className={`${styles.register} ${styles.button}`} onClick={registerEquipments}>
                <span>全て登録</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <table className={styles.registerTable}>
          <thead className={styles.thead}>
            <tr>
              <th>No.</th>
              {equipmentBaseColumn.map(col => {
                if (col.isRegistrable) {
                  return <th key={col.key}>{col.label}</th>;
                }
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {equipments.map((e, index) => {
              return (
                <tr key={e.id}>
                  <td>{index + 1}</td>
                  <td>{`${e.category}-${e.subCategory}`}</td>
                  <td>{e.maker}</td>
                  <td>{e.modelNumber}</td>
                  <td>{e.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterPage;
