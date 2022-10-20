import { Category } from '@prisma/client';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { ApiError } from '../models/api';
import { apiPath } from '../models/path';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useCategories(categoryCode: string) {
  // todo use SearchParam
  const { data, error, mutate: setCategories } = useSWRImmutable<any, ApiError>(`${apiPath.getCategories}?code=${categoryCode}`, fetcher);
  // const { data, error, mutate: setCategories } = useSWR<any, ApiError>(`${apiPath.getCategories}?code=${categoryCode}`, fetcher);

  return {
    categories: data?.categories as Category[] | undefined,
    setCategories,
    isLoading: !error && !data,
    isError: error,
  };
}
