import ky, { KyInstance } from 'ky'

const http: KyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_HOST || 'http://localhost:5555',
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
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          request.headers.set('Authorization', `Bearer ${storedToken}`)
        }
      },
    ],
    afterResponse: [
      (_, __, response) => {
        if (response.status === 401) {
          // Handle unauthorized error
          console.error('Unauthorized access - 401')
          // Optionally, you can remove the token from the store here
        } else if (response.status === 500) {
          // Handle server error
          console.error('Server error - 500')
        }
      },
    ],
  },
})

export default http
