import { create } from 'zustand'
import { IApiResponse, IHttpStore } from '@/modules/http/types.ts'
import http from '@/modules/http/ky.ts'

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as IApiResponse<T>
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data.data
}

const useHttpStore = create<IHttpStore>((_, get) => ({
  http: http,

  get: async <T>(path: string, payload?: object): Promise<T> => {
    const queryParams = payload
      ? new URLSearchParams(payload as Record<string, string>).toString()
      : ''
    const fullPath = queryParams ? `${path}?${queryParams}` : path
    const response = await get().http.get(fullPath)
    return handleApiResponse<T>(response)
  },

  post: async <T>(path: string, payload: object): Promise<T> => {
    const response = await get().http.post(path, { json: payload })
    return handleApiResponse<T>(response)
  },

  put: async <T>(path: string, payload: object): Promise<T> => {
    const response = await get().http.put(path, { json: payload })
    return handleApiResponse<T>(response)
  },

  delete: async <T>(path: string, payload?: object): Promise<T> => {
    const response = await get().http.delete(path, { json: payload })
    return handleApiResponse<T>(response)
  },

  patch: async <T>(path: string, payload: object): Promise<T> => {
    const response = await get().http.patch(path, { json: payload })
    return handleApiResponse<T>(response)
  },
}))

export default useHttpStore
