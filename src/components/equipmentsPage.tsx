import { useEffect, useState } from 'react';

import { useDepartments } from '../hooks/useDepartments';
import { useLocations } from '../hooks/useLocations';
import { useSharedState } from '../hooks/useStaticSwr';
import { client } from '../models/apiClient';
import { DepartmentModel } from '../models/departmentModel';
import { ColumnDefinition, Details, EquipmentModel } from '../models/equipmentModel';
import { LocationModel } from '../models/locationModel';
import { convertToMessage, sleep } from '../modules/util';
import { CategoryCodes } from '../pages/api/equipment/advancedSearch';
import { useErrorDialog } from './dialog/errorDialog';
import { Loading } from './loading';
import { EquipmentSearchPanel } from './searchPanel/equipmentSearchPanel';
import { Skeleton } from './skeleton';
import { EquipmentTable } from './table/equipmentTable';

type Props = {
  categoryCodes: CategoryCodes;
  departmentId?: number;
};

export const EquipmentPage = ({ categoryCodes: initialCategories, departmentId: initialDepartmentId }: Props) => {
  const showErrorDialog = useErrorDialog();

  const [departments, setDepartments] = useSharedState<DepartmentModel[]>('departments', []);
  const [, setLocations] = useSharedState<LocationModel[]>('locations', []);
  useDepartments(x => setDepartments(x));
  useLocations(x => setLocations(x));

  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
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
        const [{ equipments, columns, error }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: categoryCodes, departmentId } }),
          sleep(1000),
        ]);

        if (error) {
          showErrorDialog({ title: 'Load Failed.', description: convertToMessage(error) });
          return;
        }

        setEquipments(equipments);
        setColumns(columns);
      } catch (error) {
        setIsError(true);
        showErrorDialog({ title: 'Load Failed.', description: `failed to load equipments. ${error}` });
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [categoryCodes, departmentId]);

  const reload = () => setCategoryCodes({ ...categoryCodes });

  if (isError) return <Skeleton />;

  if (equipments == null || columns == null) return <Skeleton />;

  return (
    <>
      <EquipmentSearchPanel
        filterText={filterText}
        setFilterText={setFilterText}
        categoryCodes={categoryCodes}
        setCategoryCodes={setCategoryCodes}
        departments={departments}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
      />
      {isLoading ? <Loading /> : <EquipmentTable equipments={equipments} detailColumns={columns} filterText={filterText} reload={reload} />}
    </>
  );
};
