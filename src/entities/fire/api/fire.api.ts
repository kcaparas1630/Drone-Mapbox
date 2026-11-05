// RTK Query API for the wildfire feed and perimeters; polled every 10 min, refetched on reconnect (ADR 011, 023).
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { FetchJsonError } from '@/shared/api';

import type { FireFeedSnapshot, FirePerimeter } from '../model/fire.types';
import { fetchActiveFires } from './fetch-active-fires';
import { fetchFirePerimeters } from './fetch-fire-perimeters';

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
    getFirePerimeters: build.query<FirePerimeter[], undefined>({
      async queryFn(_unused, { signal }) {
        const result = await fetchFirePerimeters(signal);
        return result.isOk ? { data: result.value } : { error: result.error };
      },
    }),
  }),
});

export const { useGetActiveFiresQuery, useGetFirePerimetersQuery } = fireApi;
