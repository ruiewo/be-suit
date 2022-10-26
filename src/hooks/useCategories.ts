import useSWR from 'swr';

import { ApiError } from '../models/api';
import { Category } from '../models/category';
import { apiPath } from '../models/const/path';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useCategories(categoryCode: string) {
  // todo use SearchParam
  const { data, error, mutate: setCategories } = useSWR<any, ApiError>(`${apiPath.category.search}?code=${categoryCode}`, fetcher);

  return {
    categories: data?.categories as Category[] | undefined,
    setCategories,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useCategory(categoryCode: string, callback: (category: Category) => void) {
  const {
    data: category,
    error,
    mutate: setCategory,
  } = useSWR<Category, ApiError>(`${apiPath.category.get}/${categoryCode}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    onSuccess(data, key, config) {
      console.log('Category reloaded.');
      callback(data);
    },
  });

  return {
    category,
    setCategory,
    isLoading: !error && !category,
    isError: error,
  };
}
