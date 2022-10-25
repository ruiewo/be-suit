import useSWR from 'swr';
import { ApiError } from '../models/api';
import { apiPath } from '../models/path';
import { EquipmentSearchResult } from '../pages/api/equipments';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useEquipments(category: string, subCategory: string) {
  const { data, error } = useSWR<EquipmentSearchResult, ApiError>(`${apiPath.getEquipments}?cat=${category}&sub=${subCategory}`, fetcher);

  return {
    equipments: data?.equipments,
    columns: data?.columns,
    isLoading: !error && !data,
    isError: error,
  };
}
