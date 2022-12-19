import { NextPage } from 'next';
import React, { ChangeEvent, useState } from 'react';

import { useErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { Skeleton } from '../../components/skeleton';
import { useCategories } from '../../hooks/useCategories';
import { Category, CategoryBase } from '../../models/category';
import { Equipment } from '../../models/equipmentModel';
import styles from '../../styles/registerForm.module.css';

const RegisterPage: NextPage = () => {
  const showErrorDialog = useErrorDialog();

  const { categories, isLoading, isError } = useCategories('');
  const [formEquipment, setFormEquipment] = useState({ category: '', subCategory: '', maker: '', modelNumber: '', note: '' } as Equipment);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const addEquipment = async () => {
    if (formEquipment.category == '' || formEquipment.subCategory == '') {
      showErrorDialog({ title: '', description: 'カテゴリーを選択してください。' });
      return;
    }
    if (formEquipment.category == 'PC' && (formEquipment.maker == '' || formEquipment.modelNumber == '')) {
      showErrorDialog({ title: '', description: 'メーカー・型番を入力してください。' });
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

  if (isError) return <Skeleton />;

  if (isLoading) return <Loading />;

  if (categories == null) return <Skeleton />;

  return (
    <div className={styles.registerPage}>
      <div className={styles.top}>
        <div className={styles.registerForm}>
          <div className={styles.form}>
            <Form formEquipment={formEquipment} categories={categories} setFormEquipment={setFormEquipment} />
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
        <Table equipments={equipments} />
      </div>
    </div>
  );
};

export default RegisterPage;

type FormProps = {
  categories: Category[];
  formEquipment: Equipment;
  setFormEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
};

function Form({ formEquipment, categories, setFormEquipment }: FormProps) {
  const [selectableSubCategories, setSelectableSubCategories] = useState<CategoryBase[]>([]);
  const onTextChange = (event: ChangeEvent) => {
    const newFormEquipment = { ...formEquipment };
    const target = event.target as HTMLInputElement;
    
    switch (target.name) {
      case 'category':
        newFormEquipment.category = target.value;
        setSelectableSubCategories((categories?.find(x => x.code === newFormEquipment.category)?.subCategories as CategoryBase[]) ?? []);
        break;
      case 'subCategory':
        newFormEquipment.subCategory = target.value;
        break;
      case 'maker':
        newFormEquipment.maker = target.value;
        break;
      case 'modelNumber':
        newFormEquipment.modelNumber = target.value;
        break;
      case 'note':
        newFormEquipment.note = target.value;
        break;
      default:
        return;
    }

    setFormEquipment(newFormEquipment);
  };
  return (
    <>
      <div className={styles.area}>
        <div className={styles.areaIcon}>
          <span className="icon-master"></span>
          <span className={styles.iconTitle}>管理番号</span>
        </div>
        <div className={styles.controlNumber}>
          <label>メインカテゴリー</label>
          <select name="category" className={styles.select} onChange={onTextChange}>
            <option>--- メインカテゴリーを選択 ---</option>
            {categories.map(category => (
              <option key={category.code} title={category.code} value={category.code}>
                {category.code}_{category.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlNumber}>
          <label>サブカテゴリー</label>
          <select name="subCategory" className={styles.select} onChange={onTextChange}>
            <option>--- サブカテゴリーを選択 ---</option>
            {selectableSubCategories.map(subCategory => (
              <option key={subCategory.code} title={subCategory.code} value={subCategory.code}>
                {subCategory.code}_{subCategory.label}
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
        <div className={styles.category}>
          <label>メーカー</label>
          <input type="text" value={formEquipment.maker} name="maker" placeholder="メーカー" onChange={onTextChange} />
        </div>
        <div className={styles.category}>
          <label>型番</label>
          <input type="text" value={formEquipment.modelNumber} name="modelNumber" placeholder="型番" onChange={onTextChange} />
        </div>
      </div>
      <div className={styles.area}>
        <div className={styles.areaIcon}>
          <span className="icon-setting"></span>
          <span className={styles.iconTitle}>その他</span>
        </div>
        <div className={styles.category}>
          <label>備考</label>
          <textarea value={formEquipment.note} name="note" placeholder="備考" onChange={onTextChange}></textarea>
        </div>
      </div>
    </>
  );
}

const Table = ({ equipments }: { equipments: Equipment[] }) => {
  return (
    <table className={styles.registerTable}>
      <thead className={styles.thead}>
        <tr>
          <th>No.</th>
          <th>管理番号</th>
          <th>メーカー</th>
          <th>型番</th>
          <th>備考</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {equipments.map((equipment, index) => {
          return (
            <tr key={equipment.id}>
              <td>{index + 1}</td>
              <td>{`${equipment.category}-${equipment.subCategory}`}</td>
              <td>{equipment.maker}</td>
              <td>{equipment.modelNumber}</td>
              <td>{equipment.note}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
