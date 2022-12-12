import { NextPage } from 'next';
import React, { ChangeEvent, useState } from 'react';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { useCategories } from '../../hooks/useCategories';
import { CategoryBase } from '../../models/category';
import { Equipment } from '../../models/equipmentModel';
import styles from '../../styles/registerForm.module.css';

const RegisterPage: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const columns = [
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
  const [subCategories, setSubCategories] = useState<CategoryBase[]>([]);
  const [formEquipment, setFormEquipment] = useState({ category: '', subCategory: '', maker: '', modelNumber: '', note: '' } as Equipment);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const onTextChange = (event: ChangeEvent) => {
    const equipment = { ...formEquipment };
    const target = event.target as HTMLInputElement;
    const value = target.value;

    switch (target.name) {
      case 'category':
        equipment.category = value;
        setSubCategories(categories?.find(x => x.code === equipment.category)?.subCategories ?? []);
        break;
      case 'subCategory':
        equipment.subCategory = value;
        break;
      case 'maker':
        equipment.maker = value;
        break;
      case 'modelNumber':
        equipment.modelNumber = value;
        break;
      case 'note':
        equipment.note = value;
        break;
      default:
        return;
    }

    setFormEquipment(equipment);
  };

  const addEquipment = async () => {
    if (formEquipment.category == '' || formEquipment.subCategory == '') {
      setErrorMessage('カテゴリーを選択してください。');
      return;
    }
    if (formEquipment.category == 'パソコン' && (formEquipment.maker == '' || formEquipment.modelNumber == '')) {
      setErrorMessage('メーカー・型番を入力してください。');
      return;
    }

    setEquipments([...equipments, formEquipment]);

    setFormEquipment({
      ...formEquipment,
      maker: '',
      modelNumber: '',
      note: '',
    });
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
                <span className="icon-master"></span>
                <span className={styles.iconTitle}>管理番号</span>
              </div>
              <div className={styles.controlNumber}>
                <label>メインカテゴリー</label>
                <select name="category" className={styles.select} onChange={onTextChange}>
                  <option>--- メインカテゴリーを選択 ---</option>
                  {categories.map(x => (
                    <option key={x.code} title={x.code} value={x.code}>
                      {x.code}_{x.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.controlNumber}>
                <label>サブカテゴリー</label>
                <select name="subCategory" className={styles.select} onChange={onTextChange}>
                  <option>--- サブカテゴリーを選択 ---</option>
                  {subCategories.map(x => (
                    <option key={x.code} title={x.code} value={x.code}>
                      {x.code}_{x.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.area}>
              <div className={styles.areaIcon}>
                <span className="icon-computer"></span>
                <span className={styles.iconTitle}>PC情報</span>
              </div>
              {columns
                .filter(x => x.key === 'maker' || x.key === 'modelNumber')
                .map(x => (
                  <div className={styles.category} key={x.key}>
                    <label>{x.label}</label>
                    {/* @ts-ignore  */}
                    <input value={formEquipment[x.key]} name={x.key} placeholder={x.label} type={x.type} onChange={onTextChange} />
                  </div>
                ))}
            </div>
            <div className={styles.area}>
              <div className={styles.areaIcon}>
                <span className={`icon-setting`}></span>
                <span className={styles.iconTitle}>その他</span>
              </div>
              {columns
                .filter(x => x.key === 'note')
                .map(x => (
                  <div className={styles.category} key={x.key}>
                    <label>{x.label}</label>
                    {/* @ts-ignore  */}
                    <textarea value={formEquipment[x.key]} name={x.key} placeholder={x.label} onChange={onTextChange} />
                  </div>
                ))}
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
              {columns.map(col => {
                if (col.isRegistrable) {
                  return <th key={col.key}>{col.label}</th>;
                }
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {equipments.map((x, index) => {
              return (
                <tr key={x.id}>
                  <td>{index + 1}</td>
                  <td>{`${x.category}-${x.subCategory}`}</td>
                  <td>{x.maker}</td>
                  <td>{x.modelNumber}</td>
                  <td>{x.note}</td>
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
