import useAspidaSWR from '@aspida/swr';

import { client } from '../models/apiClient';
import { Category } from '../models/category';

export function useCategories(categoryCode: string) {
  const { data, error, mutate: setCategories } = useAspidaSWR(client.api.category.search, { query: { code: categoryCode } });

  return {
    categories: data?.categories,
    setCategories,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useCategory(categoryCode: string, callback: (category: Category) => void) {
  const { data, error } = useAspidaSWR(client.api.category._code_(categoryCode), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    onSuccess(successData) {
      callback(successData.category);
    },
  });

  return {
    category: data?.category,
    isLoading: !error && !data,
    isError: error,
  };
}
