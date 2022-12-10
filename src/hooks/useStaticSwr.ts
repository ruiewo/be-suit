import useSWR from 'swr';

export const useSharedState = <T>(key: string, initial: T) => {
  const { data: state, mutate: setState } = useSWR(key, null, {
    fallbackData: initial,
  });

  return [state, setState] as [T, (value: T) => void];
};
