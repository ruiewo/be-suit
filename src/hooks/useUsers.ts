import useAspidaSWR from '@aspida/swr';

import { client } from '../models/apiClient';

export function useUsersMe() {
  const { data, error } = useAspidaSWR(client.api.user.me);

  return {
    equipments: data?.equipments,
    isLoading: !error && !data,
    isError: error,
  };
}
