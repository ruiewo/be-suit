import type { AspidaClient } from 'aspida'
import { dataToURLString } from 'aspida'
import type { Methods as Methods0 } from './api/category/[code]'
import type { Methods as Methods1 } from './api/category/search'
import type { Methods as Methods2 } from './api/category/update'
import type { Methods as Methods3 } from './api/department/search'
import type { Methods as Methods4 } from './api/equipment/[id]'
import type { Methods as Methods5 } from './api/equipment/advancedSearch'
import type { Methods as Methods6 } from './api/equipment/search'
import type { Methods as Methods7 } from './api/equipment/update'
import type { Methods as Methods8 } from './api/user/me'
import type { Methods as Methods9 } from './api/user/search'
import type { Methods as Methods10 } from './api/user/update'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/category'
  const PATH1 = '/api/category/search'
  const PATH2 = '/api/category/update'
  const PATH3 = '/api/department/search'
  const PATH4 = '/api/equipment'
  const PATH5 = '/api/equipment/advancedSearch'
  const PATH6 = '/api/equipment/search'
  const PATH7 = '/api/equipment/update'
  const PATH8 = '/api/user/me'
  const PATH9 = '/api/user/search'
  const PATH10 = '/api/user/update'
  const PATH11 = '/equipment'
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
        }
      },
      equipment: {
        _id_: (val2: number | string) => {
          const prefix2 = `${PATH4}/${val2}`

          return {
            get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods4['get']['resBody']>(prefix, prefix2, GET, option).json(),
            $get: (option?: { config?: T | undefined } | undefined) =>
              fetch<Methods4['get']['resBody']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        },
        advancedSearch: {
          post: (option: { body: Methods5['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods5['post']['resBody']>(prefix, PATH5, POST, option).json(),
          $post: (option: { body: Methods5['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods5['post']['resBody']>(prefix, PATH5, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH5}`
        },
        search: {
          get: (option: { query: Methods6['get']['query'], config?: T | undefined }) =>
            fetch<Methods6['get']['resBody']>(prefix, PATH6, GET, option).json(),
          $get: (option: { query: Methods6['get']['query'], config?: T | undefined }) =>
            fetch<Methods6['get']['resBody']>(prefix, PATH6, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods6['get']['query'] } | undefined) =>
            `${prefix}${PATH6}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods7['post']['resBody']>(prefix, PATH7, POST, option).json(),
          $post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods7['post']['resBody']>(prefix, PATH7, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH7}`
        }
      },
      user: {
        me: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods8['get']['resBody']>(prefix, PATH8, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH8}`
        },
        search: {
          post: (option: { body: Methods9['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods9['post']['resBody']>(prefix, PATH9, POST, option).json(),
          $post: (option: { body: Methods9['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods9['post']['resBody']>(prefix, PATH9, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH9}`
        },
        update: {
          post: (option: { body: Methods10['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods10['post']['resBody']>(prefix, PATH10, POST, option).json(),
          $post: (option: { body: Methods10['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods10['post']['resBody']>(prefix, PATH10, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH10}`
        }
      }
    },
    equipment: {
      _category_: (val1: number | string) => {
        const prefix1 = `${PATH11}/${val1}`

      }
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
