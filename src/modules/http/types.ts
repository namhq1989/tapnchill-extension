import { KyInstance } from 'ky'

export interface IHttpStore {
  http: KyInstance

  get: <T>(path: string, payload?: object) => Promise<T>
  post: <T>(path: string, payload: object) => Promise<T>
  put: <T>(path: string, payload: object) => Promise<T>
  delete: <T>(path: string, payload: object) => Promise<T>
  patch: <T>(path: string, payload: object) => Promise<T>
}

export interface IApiResponse<T> {
  data: T
  message: string
  code: string
}
