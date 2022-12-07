import { useEffect, useState } from 'react';

import { client } from '../models/apiClient';
import { ColumnDefinition, Details, Equipment } from '../models/equipment';
import { sleep } from '../modules/util';
import { ErrorDialog } from './dialog/errorDialog';
import { Loading } from './loading';
import { EquipmentSearchPanel } from './searchPanel/equipmentSearchPanel';
import { EquipmentTable } from './table/equipmentTable';

type Props = {
  category: string;
};

export const EquipmentPage = ({ category }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState([category]);

  const [filterText, setFilterText] = useState('');

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition<Details>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ equipments, columns }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: selectedCategories } }),
          sleep(1000),
        ]);

        setEquipments(equipments);
        setColumns(columns);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [selectedCategories]);

  const reload = () => setSelectedCategories([...selectedCategories]);

  if (isError) return <ErrorDialog />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return (
    <>
      <EquipmentSearchPanel
        filterText={filterText}
        setFilterText={setFilterText}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {isLoading ? <Loading /> : <EquipmentTable equipments={equipments} columns={columns} filterText={filterText} reload={reload} />}
    </>
  );
};
