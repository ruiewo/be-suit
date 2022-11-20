import aspida from '@aspida/fetch';
import useAspidaSWR from '@aspida/swr';

import api from '../pages/$api';

const client = api(aspida());

export function useUsersMe() {
  const { data, error } = useAspidaSWR(client.api.user.me);

  return {
    equipments: data?.equipments,
    isLoading: !error && !data,
    isError: error,
  };
}
