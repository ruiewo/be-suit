import useSWR from 'swr';

import { ApiError } from '../models/api';
import { apiPath } from '../models/const/path';
import { EquipmentSearchResult } from '../pages/api/search/equipments';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useEquipments(category: string, subCategory: string) {
  const { data, error } = useSWR<EquipmentSearchResult, ApiError>(`${apiPath.equipment.search}?cat=${category}&sub=${subCategory}`, fetcher);

  return {
    equipments: data?.equipments,
    columns: data?.columns,
    isLoading: !error && !data,
    isError: error,
  };
}
