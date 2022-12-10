import useAspidaSWR from '@aspida/swr';

import { client } from '../models/apiClient';
import { DepartmentModel } from '../models/departmentModel';

export function useDepartments(callback: (x: DepartmentModel[]) => void) {
  const { data, error } = useAspidaSWR(client.api.department.search, {
    query: {},

    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    onSuccess(successData) {
      callback(successData.departments);
    },
  });

  return {
    departments: data?.departments,
    isLoading: !error && !data,
    isError: error,
  };
}
