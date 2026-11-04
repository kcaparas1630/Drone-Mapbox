// RTK Query API for the wildfire feed; components poll it every 10 min and refetch on reconnect (ADR 011).
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { FetchJsonError } from '@/shared/api';

import type { FireFeedSnapshot } from '../model/fire.types';
import { fetchActiveFires } from './fetch-active-fires';

export type FireFeedQueryArgs = { isOutIncluded: boolean };

export const fireApi = createApi({
  reducerPath: 'fireApi',
  baseQuery: fakeBaseQuery<FetchJsonError>(),
  keepUnusedDataFor: 3600,
  endpoints: (build) => ({
    getActiveFires: build.query<FireFeedSnapshot, FireFeedQueryArgs>({
      async queryFn({ isOutIncluded }, { signal }) {
        const result = await fetchActiveFires(isOutIncluded, signal);
        return result.isOk ? { data: result.value } : { error: result.error };
      },
    }),
  }),
});

export const { useGetActiveFiresQuery } = fireApi;
