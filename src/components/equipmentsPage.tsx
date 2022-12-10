import { useEffect, useState } from 'react';

import { client } from '../models/apiClient';
import { ColumnDefinition, Details, EquipmentModel } from '../models/equipmentModel';
import { sleep } from '../modules/util';
import { CategoryCodes } from '../pages/api/equipment/advancedSearch';
import { ErrorDialog } from './dialog/errorDialog';
import { Loading } from './loading';
import { EquipmentSearchPanel } from './searchPanel/equipmentSearchPanel';
import { EquipmentTable } from './table/equipmentTable';

type Props = {
  categoryCodes: CategoryCodes;
};

export const EquipmentPage = ({ categoryCodes: initialCategories }: Props) => {
  const [categoryCodes, setCategoryCodes] = useState(initialCategories);

  const [filterText, setFilterText] = useState('');

  const [equipments, setEquipments] = useState<EquipmentModel[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition<Details>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ equipments, columns }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: categoryCodes } }),
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
  }, [categoryCodes]);

  const reload = () => setCategoryCodes({ ...categoryCodes });

  if (isError) return <ErrorDialog />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return (
    <>
      <EquipmentSearchPanel filterText={filterText} setFilterText={setFilterText} categoryCodes={categoryCodes} setCategoryCodes={setCategoryCodes} />
      {isLoading ? <Loading /> : <EquipmentTable equipments={equipments} columns={columns} filterText={filterText} reload={reload} />}
    </>
  );
};
