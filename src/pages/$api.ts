import type { AspidaClient } from 'aspida'
import { dataToURLString } from 'aspida'
import type { Methods as Methods0 } from './api/category/[code]'
import type { Methods as Methods1 } from './api/category/search'
import type { Methods as Methods2 } from './api/category/update'
import type { Methods as Methods3 } from './api/department/search'
import type { Methods as Methods4 } from './api/department/update'
import type { Methods as Methods5 } from './api/equipment/[id]'
import type { Methods as Methods6 } from './api/equipment/advancedSearch'
import type { Methods as Methods7 } from './api/equipment/create'
import type { Methods as Methods8 } from './api/equipment/search'
import type { Methods as Methods9 } from './api/equipment/update'
import type { Methods as Methods10 } from './api/location/search'
import type { Methods as Methods11 } from './api/location/update'
import type { Methods as Methods12 } from './api/rentalApplication/rentRequest'
import type { Methods as Methods13 } from './api/rentalApplication/returnRequest'
import type { Methods as Methods14 } from './api/test/study'
import type { Methods as Methods15 } from './api/user/me'
import type { Methods as Methods16 } from './api/user/search'
import type { Methods as Methods17 } from './api/user/update'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/category'
  const PATH1 = '/api/category/search'
  const PATH2 = '/api/category/update'
  const PATH3 = '/api/department/search'
  const PATH4 = '/api/department/update'
  const PATH5 = '/api/equipment'
  const PATH6 = '/api/equipment/advancedSearch'
  const PATH7 = '/api/equipment/create'
  const PATH8 = '/api/equipment/search'
  const PATH9 = '/api/equipment/update'
  const PATH10 = '/api/location/search'
  const PATH11 = '/api/location/update'
  const PATH12 = '/api/rentalApplication/rentRequest'
  const PATH13 = '/api/rentalApplication/returnRequest'
  const PATH14 = '/api/test/study'
  const PATH15 = '/api/user/me'
  const PATH16 = '/api/user/search'
  const PATH17 = '/api/user/update'
  const PATH18 = '/equipment'
  const GET = 'GET'
  const POST = 'POST'

  return {
    api: {
      category: {
        _code_: (val2: number | string) => {
          const prefix2 = `${PATH0}/${val2}`

          return {
            get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods0['get']['resBody']>(prefix, prefix2, GET, option).json(),
            $get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods0['get']['resBody']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        },
        search: {
          get: (option: { query: Methods1['get']['query'], config?: T | undefined }) =>
            fetch<Methods1['get']['resBody']>(prefix, PATH1, GET, option).json(),
          $get: (option: { query: Methods1['get']['query'], config?: T | undefined }) =>
            fetch<Methods1['get']['resBody']>(prefix, PATH1, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods1['get']['query'] } | undefined) =>
            `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods2['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods2['post']['resBody']>(prefix, PATH2, POST, option).json(),
          $post: (option: { body: Methods2['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods2['post']['resBody']>(prefix, PATH2, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH2}`
        }
      },
      department: {
        search: {
          get: (option: { query: Methods3['get']['query'], config?: T | undefined }) =>
            fetch<Methods3['get']['resBody']>(prefix, PATH3, GET, option).json(),
          $get: (option: { query: Methods3['get']['query'], config?: T | undefined }) =>
            fetch<Methods3['get']['resBody']>(prefix, PATH3, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods3['get']['query'] } | undefined) =>
            `${prefix}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods4['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods4['post']['resBody']>(prefix, PATH4, POST, option).json(),
          $post: (option: { body: Methods4['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods4['post']['resBody']>(prefix, PATH4, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH4}`
        }
      },
      equipment: {
        _id_: (val2: number | string) => {
          const prefix2 = `${PATH5}/${val2}`

          return {
            get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods5['get']['resBody']>(prefix, prefix2, GET, option).json(),
            $get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods5['get']['resBody']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        },
        advancedSearch: {
          post: (option: { body: Methods6['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods6['post']['resBody']>(prefix, PATH6, POST, option).json(),
          $post: (option: { body: Methods6['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods6['post']['resBody']>(prefix, PATH6, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH6}`
        },
        create: {
          post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods7['post']['resBody']>(prefix, PATH7, POST, option).json(),
          $post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods7['post']['resBody']>(prefix, PATH7, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH7}`
        },
        search: {
          get: (option: { query: Methods8['get']['query'], config?: T | undefined }) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json(),
          $get: (option: { query: Methods8['get']['query'], config?: T | undefined }) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods8['get']['query'] } | undefined) =>
            `${prefix}${PATH8}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods9['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods9['post']['resBody']>(prefix, PATH9, POST, option).json(),
          $post: (option: { body: Methods9['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods9['post']['resBody']>(prefix, PATH9, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH9}`
        }
      },
      location: {
        search: {
          get: (option: { query: Methods10['get']['query'], config?: T | undefined }) =>
            fetch<Methods10['get']['resBody']>(prefix, PATH10, GET, option).json(),
          $get: (option: { query: Methods10['get']['query'], config?: T | undefined }) =>
            fetch<Methods10['get']['resBody']>(prefix, PATH10, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods10['get']['query'] } | undefined) =>
            `${prefix}${PATH10}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods11['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods11['post']['resBody']>(prefix, PATH11, POST, option).json(),
          $post: (option: { body: Methods11['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods11['post']['resBody']>(prefix, PATH11, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH11}`
        }
      },
      rentalApplication: {
        rentRequest: {
          post: (option: { body: Methods12['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods12['post']['resBody']>(prefix, PATH12, POST, option).json(),
          $post: (option: { body: Methods12['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods12['post']['resBody']>(prefix, PATH12, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH12}`
        },
        returnRequest: {
          post: (option: { body: Methods13['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods13['post']['resBody']>(prefix, PATH13, POST, option).json(),
          $post: (option: { body: Methods13['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods13['post']['resBody']>(prefix, PATH13, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH13}`
        }
      },
      test: {
        study: {
          post: (option: { body: Methods14['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods14['post']['resBody']>(prefix, PATH14, POST, option).json(),
          $post: (option: { body: Methods14['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods14['post']['resBody']>(prefix, PATH14, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH14}`
        }
      },
      user: {
        me: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods15['get']['resBody']>(prefix, PATH15, GET, option).json(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods15['get']['resBody']>(prefix, PATH15, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH15}`
        },
        search: {
          post: (option: { body: Methods16['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods16['post']['resBody']>(prefix, PATH16, POST, option).json(),
          $post: (option: { body: Methods16['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods16['post']['resBody']>(prefix, PATH16, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH16}`
        },
        update: {
          post: (option: { body: Methods17['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods17['post']['resBody']>(prefix, PATH17, POST, option).json(),
          $post: (option: { body: Methods17['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods17['post']['resBody']>(prefix, PATH17, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH17}`
        }
      }
    },
    equipment: {
      _category_: (val1: number | string) => {
        const prefix1 = `${PATH18}/${val1}`

      }
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
