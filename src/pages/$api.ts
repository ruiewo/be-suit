import type { AspidaClient } from 'aspida'
import { dataToURLString } from 'aspida'
import type { Methods as Methods0 } from './api/category/[code]'
import type { Methods as Methods1 } from './api/category/search'
import type { Methods as Methods2 } from './api/category/update'
import type { Methods as Methods3 } from './api/department/search'
import type { Methods as Methods4 } from './api/department/update'
import type { Methods as Methods5 } from './api/equipment/[id]'
import type { Methods as Methods6 } from './api/equipment/advancedSearch'
import type { Methods as Methods7 } from './api/equipment/search'
import type { Methods as Methods8 } from './api/equipment/update'
import type { Methods as Methods9 } from './api/user/me'
import type { Methods as Methods10 } from './api/user/search'
import type { Methods as Methods11 } from './api/user/update'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/category'
  const PATH1 = '/api/category/search'
  const PATH2 = '/api/category/update'
  const PATH3 = '/api/department/search'
  const PATH4 = '/api/department/update'
  const PATH5 = '/api/equipment'
  const PATH6 = '/api/equipment/advancedSearch'
  const PATH7 = '/api/equipment/search'
  const PATH8 = '/api/equipment/update'
  const PATH9 = '/api/user/me'
  const PATH10 = '/api/user/search'
  const PATH11 = '/api/user/update'
  const PATH12 = '/equipment'
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
        search: {
          get: (option: { query: Methods7['get']['query'], config?: T | undefined }) =>
            fetch<Methods7['get']['resBody']>(prefix, PATH7, GET, option).json(),
          $get: (option: { query: Methods7['get']['query'], config?: T | undefined }) =>
            fetch<Methods7['get']['resBody']>(prefix, PATH7, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get' | undefined; query: Methods7['get']['query'] } | undefined) =>
            `${prefix}${PATH7}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        update: {
          post: (option: { body: Methods8['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods8['post']['resBody']>(prefix, PATH8, POST, option).json(),
          $post: (option: { body: Methods8['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods8['post']['resBody']>(prefix, PATH8, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH8}`
        }
      },
      user: {
        me: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods9['get']['resBody']>(prefix, PATH9, GET, option).json(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods9['get']['resBody']>(prefix, PATH9, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH9}`
        },
        search: {
          post: (option: { body: Methods10['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods10['post']['resBody']>(prefix, PATH10, POST, option).json(),
          $post: (option: { body: Methods10['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods10['post']['resBody']>(prefix, PATH10, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH10}`
        },
        update: {
          post: (option: { body: Methods11['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods11['post']['resBody']>(prefix, PATH11, POST, option).json(),
          $post: (option: { body: Methods11['post']['reqBody'], config?: T | undefined }) =>
            fetch<Methods11['post']['resBody']>(prefix, PATH11, POST, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH11}`
        }
      }
    },
    equipment: {
      _category_: (val1: number | string) => {
        const prefix1 = `${PATH12}/${val1}`

      }
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
