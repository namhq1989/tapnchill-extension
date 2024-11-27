import ky, { KyInstance } from 'ky'
import useAppStore from '@/modules/common/store.ts'

interface INotSuccessResponse {
  code: string
  message: string
}

const http: KyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_HOST || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  // retry: {
  //   limit: 1,
  // },
  hooks: {
    beforeRequest: [
      (request) => {
        const { userToken } = useAppStore.getState()
        if (userToken) {
          request.headers.set('Authorization', `Bearer ${userToken}`)
        }
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401) {
          // Handle unauthorized error
          console.error('Unauthorized access - 401')
          // Optionally, you can remove the token from the store here
        } else if (response.status === 500) {
          // Handle server error
          console.error('Server error - 500')
        } else if (!response.ok) {
          const error: INotSuccessResponse = await response.json()
          throw new Error(error.message)
        }
      },
    ],
  },
})

export default http
