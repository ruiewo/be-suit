import type { AspidaClient } from 'aspida'
import { dataToURLString } from 'aspida'
import type { Methods as Methods0 } from './api/category/[code]'
import type { Methods as Methods1 } from './api/category/search'
import type { Methods as Methods2 } from './api/category/update'
import type { Methods as Methods3 } from './api/equipment/advancedSearch'
import type { Methods as Methods4 } from './api/equipment/search'
import type { Methods as Methods5 } from './api/equipment/update'
import type { Methods as Methods6 } from './api/user/me'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/category'
  const PATH1 = '/api/category/search'
  const PATH2 = '/api/category/update'
  const PATH3 = '/api/equipment/advancedSearch'
  const PATH4 = '/api/equipment/search'
  const PATH5 = '/api/equipment/update'
  const PATH6 = '/api/user/me'
  const PATH7 = '/equipment'
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
        advancedSearch: {
          post: (option: { body: Methods3['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods3['post']['resBody']>(prefix, PATH3, POST, option).json(),
          $post: (option: { body: Methods3['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods3['post']['resBody']>(prefix, PATH3, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH3}`
        },
        search: {
          get: (option: { query: Methods4['get']['query'], config?: T | undefined }) =>
            fetch<Methods4['get']['resBody']>(prefix, PATH4, GET, option).json(),
          $get: (option: { query: Methods4['get']['query'], config?: T | undefined }) =>
            fetch<Methods4['get']['resBody']>(prefix, PATH4, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods4['get']['query'] } | undefined) =>
            `${prefix}${PATH4}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods5['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods5['post']['resBody']>(prefix, PATH5, POST, option).json(),
          $post: (option: { body: Methods5['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods5['post']['resBody']>(prefix, PATH5, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH5}`
        }
      },
      user: {
        me: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods6['get']['resBody']>(prefix, PATH6, GET, option).json(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods6['get']['resBody']>(prefix, PATH6, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH6}`
        }
      }
    },
    equipment: {
      _category_: (val1: number | string) => {
        const prefix1 = `${PATH7}/${val1}`

      }
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
