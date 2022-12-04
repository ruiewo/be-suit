import useAspidaSWR from '@aspida/swr';

import { client } from '../models/apiClient';

export function useEquipments(category: string, subCategory: string) {
  const { data, error } = useAspidaSWR(client.api.equipment.search, { query: { cat: category, sub: subCategory } });

  return {
    equipments: data?.equipments,
    columns: data?.columns,
    isLoading: !error && !data,
    isError: error,
  };
}
