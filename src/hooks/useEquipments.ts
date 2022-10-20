import useSWR from 'swr';
import { EquipmentWithUser } from '../models/equipment';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useEquipments(category: string, subCategory: string) {
  const { data, error } = useSWR<any, any>(`/api/equipments?cat=${category}&sub=${subCategory}`, fetcher);

  return {
    equipments: data?.equipments as EquipmentWithUser[],
    isLoading: !error && !data,
    isError: error,
  };
}
