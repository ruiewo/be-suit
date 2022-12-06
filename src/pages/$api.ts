import type { AspidaClient } from 'aspida'
import { dataToURLString } from 'aspida'
import type { Methods as Methods0 } from './api/category/[code]'
import type { Methods as Methods1 } from './api/category/search'
import type { Methods as Methods2 } from './api/category/update'
import type { Methods as Methods3 } from './api/equipment/[id]'
import type { Methods as Methods4 } from './api/equipment/advancedSearch'
import type { Methods as Methods5 } from './api/equipment/search'
import type { Methods as Methods6 } from './api/equipment/update'
import type { Methods as Methods7 } from './api/user/me'
import type { Methods as Methods8 } from './api/user/search'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/category'
  const PATH1 = '/api/category/search'
  const PATH2 = '/api/category/update'
  const PATH3 = '/api/equipment'
  const PATH4 = '/api/equipment/advancedSearch'
  const PATH5 = '/api/equipment/search'
  const PATH6 = '/api/equipment/update'
  const PATH7 = '/api/user/me'
  const PATH8 = '/api/user/search'
  const PATH9 = '/equipment'
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
      equipment: {
        _id_: (val2: number | string) => {
          const prefix2 = `${PATH3}/${val2}`

          return {
            get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods3['get']['resBody']>(prefix, prefix2, GET, option).json(),
            $get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods3['get']['resBody']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        },
        advancedSearch: {
          post: (option: { body: Methods4['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods4['post']['resBody']>(prefix, PATH4, POST, option).json(),
          $post: (option: { body: Methods4['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods4['post']['resBody']>(prefix, PATH4, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH4}`
        },
        search: {
          get: (option: { query: Methods5['get']['query'], config?: T | undefined }) =>
            fetch<Methods5['get']['resBody']>(prefix, PATH5, GET, option).json(),
          $get: (option: { query: Methods5['get']['query'], config?: T | undefined }) =>
            fetch<Methods5['get']['resBody']>(prefix, PATH5, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods5['get']['query'] } | undefined) =>
            `${prefix}${PATH5}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods6['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods6['post']['resBody']>(prefix, PATH6, POST, option).json(),
          $post: (option: { body: Methods6['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods6['post']['resBody']>(prefix, PATH6, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH6}`
        }
      },
      user: {
        me: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods7['get']['resBody']>(prefix, PATH7, GET, option).json(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods7['get']['resBody']>(prefix, PATH7, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH7}`
        },
        search: {
          get: (option: { query: Methods8['get']['query'], config?: T | undefined }) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json(),
          $get: (option: { query: Methods8['get']['query'], config?: T | undefined }) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods8['get']['query'] } | undefined) =>
            `${prefix}${PATH8}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        }
      }
    },
    equipment: {
      _category_: (val1: number | string) => {
        const prefix1 = `${PATH9}/${val1}`

      }
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
