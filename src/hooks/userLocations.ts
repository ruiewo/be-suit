import useAspidaSWR from '@aspida/swr';

import { client } from '../models/apiClient';
import { LocationModel } from '../models/locationModel';

export function useLocations(callback: (x: LocationModel[]) => void) {
  const { data, error } = useAspidaSWR(client.api.location.search, {
    query: {},

    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    onSuccess(successData) {
      callback(successData.locations);
    },
  });

  return {
    locations: data?.locations,
    isLoading: !error && !data,
    isError: error,
  };
}
