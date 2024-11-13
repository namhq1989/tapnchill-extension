import { create } from 'zustand'
import {
  IAnonymousSignUpApiRequest,
  IAnonymousSignUpApiResponse,
  IAppStore,
} from '@/types.ts'
import useHttpStore from '@/modules/http/store.ts'

const ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const useAppStore = create<IAppStore>((set, get) => ({
  userId: '',
  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })

    return new Promise((resolve) => {
      chrome.storage.local.get(async (result) => {
        const anonymousUserId: string = result.anonymousUserId || ''
        const accessToken: string = result.accessToken || ''

        if (!anonymousUserId || !accessToken) {
          // if user id not found, this means current user is new to the extension
          // call server api to create a new user
          const { anonymousSignUp } = get()
          await anonymousSignUp()
        } else {
          // if user id found, this means current user is returning to the extension
          const { setAccessToken } = useHttpStore.getState()
          setAccessToken(accessToken)

          set({ userId: anonymousUserId })
        }

        set({ isInitializing: false })
        resolve()
      })
    })
  },
  generateAnonymousUserId: (length = 24) => {
    return Array.from({ length }, () =>
      ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length)),
    ).join('')
  },
  createAnonymousSignUpChecksum: async (anonymousUserId): Promise<string> => {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(
        import.meta.env.VITE_ANONYMOUS_USER_CHECKSUM_SECRET,
      ),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(anonymousUserId),
    )

    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  },
  anonymousSignUp: async () => {
    const { post: httpPost } = useHttpStore.getState()
    const { generateAnonymousUserId, createAnonymousSignUpChecksum } = get()

    const clientId = generateAnonymousUserId(24)
    const checksum = await createAnonymousSignUpChecksum(clientId)

    const response = await httpPost<IAnonymousSignUpApiResponse>(
      'api/user/sign-up/anonymous',
      {
        clientId,
        source: 'extension',
        checksum,
      } as IAnonymousSignUpApiRequest,
    )

    if (response && response.accessToken) {
      set({ userId: clientId })

      chrome.storage.local
        .set({
          anonymousUserId: clientId,
          accessToken: response.accessToken,
        })
        .then()
    }
  },

  weekdays: [
    {
      id: 'monday',
      name: 'Mon',
    },
    {
      id: 'tuesday',
      name: 'Tue',
    },
    {
      id: 'wednesday',
      name: 'Wed',
    },
    {
      id: 'thursday',
      name: 'Thu',
    },
    {
      id: 'friday',
      name: 'Fri',
    },
    {
      id: 'saturday',
      name: 'Sat',
    },
    {
      id: 'sunday',
      name: 'Sun',
    },
  ],
}))

export default useAppStore
