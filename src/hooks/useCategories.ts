import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { ApiError } from '../models/api';
import { Category } from '../models/category';
import { apiPath } from '../models/path';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useCategories(categoryCode: string) {
  // todo use SearchParam
  const { data, error, mutate: setCategories } = useSWR<any, ApiError>(`${apiPath.getCategories}?code=${categoryCode}`, fetcher);

  return {
    categories: data?.categories as Category[] | undefined,
    setCategories,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useCategory(categoryCode: string) {
  // todo use SearchParam
  const { data: category, error, mutate: setCategory } = useSWRImmutable<Category, ApiError>(`${apiPath.getCategory}/${categoryCode}`, fetcher);
  // const {
  //   data: category,
  //   error,
  //   mutate: setCategory,
  // } = useSWR<Category, ApiError>(`${apiPath.getCategory}/${categoryCode}`, fetcher, {
  //   revalidateIfStale: false,
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  //   // revalidateOnMount: true,
  // });

  console.log('RENDER USE CATEGORY');

  return {
    category,
    setCategory,
    isLoading: !error && !category,
    isError: error,
  };
}
