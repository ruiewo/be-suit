import useSWR from 'swr';

import aspida from '@aspida/fetch';
import useAspidaSWR from '@aspida/swr';

import { ApiError } from '../models/api';
import { Category } from '../models/category';
import { apiPath } from '../models/const/path';
import api from '../pages/$api';

const client = api(aspida());

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
export function useCategories2(categoryCode: string) {
  const { data, error, mutate: setCategories } = useAspidaSWR(client.api.category.search, { query: { code: categoryCode } });

  return {
    categories: data?.categories,
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
export function useCategory2(categoryCode: string, callback: (category: Category) => void) {
  const {
    data,
    error,
    mutate: setCategory,
  } = useAspidaSWR(client.api.category._code_(categoryCode), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    onSuccess(successData, key, config) {
      console.log('Category reloaded.');
      callback(successData.category);
    },
  });

  return {
    category: data?.category,
    setCategory,
    isLoading: !error && !data,
    isError: error,
  };
}
