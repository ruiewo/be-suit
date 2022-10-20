import useSWR from 'swr';
import { ApiError } from '../models/api';
import { EquipmentWithUser } from '../models/equipment';
import { apiPath } from '../models/path';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useEquipments(category: string, subCategory: string) {
  const { data, error } = useSWR<any, ApiError>(`${apiPath.getEquipments}?cat=${category}&sub=${subCategory}`, fetcher);

  return {
    equipments: data?.equipments as EquipmentWithUser[],
    isLoading: !error && !data,
    isError: error,
  };
}
