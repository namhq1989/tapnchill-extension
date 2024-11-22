import { create } from 'zustand'
import {
  IAnonymousSignInApiRequest,
  IAnonymousSignInApiResponse,
  IAppStore,
  IGoogleSignInApiRequest,
  IGoogleSignInApiResponse,
} from '@/modules/common/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const useAppStore = create<IAppStore>((set, get) => ({
  userId: '',
  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })

    return new Promise((resolve) => {
      chrome.storage.local.get(async (result) => {
        const userId: string = result.userId || ''
        const anonymousUserId: string = result.anonymousUserId || ''
        const accessToken: string = result.accessToken || ''

        if (!anonymousUserId || !accessToken) {
          // if user id not found, this means current user is new to the extension
          // call server api to create a new user
          const { anonymousSignIn } = get()
          await anonymousSignIn()
        } else {
          // if user id found, this means current user is returning to the extension
          const { setAccessToken } = useHttpStore.getState()
          setAccessToken(accessToken)

          set({ userId: userId })
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
  createAnonymousSignInChecksum: async (anonymousUserId): Promise<string> => {
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
  anonymousSignIn: async () => {
    const { post: httpPost } = useHttpStore.getState()
    const { generateAnonymousUserId, createAnonymousSignInChecksum } = get()

    const clientId = generateAnonymousUserId(24)
    const checksum = await createAnonymousSignInChecksum(clientId)

    const response = await httpPost<IAnonymousSignInApiResponse>(
      'api/user/sign-in/extension',
      {
        clientId,
        checksum,
      } as IAnonymousSignInApiRequest,
    )

    if (response && response.accessToken) {
      set({ userId: response.userId })

      chrome.storage.local
        .set({
          anonymousUserId: clientId,
          accessToken: response.accessToken,
          userId: response.userId,
        })
        .then()
    }
  },

  googleSignIn: async (token) => {
    const { post: httpPost } = useHttpStore.getState()
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      const response = await httpPost<IGoogleSignInApiResponse>(
        'api/user/sign-in/google',
        {
          token,
        } as IGoogleSignInApiRequest,
      )

      if (response && response.accessToken) {
        set({ userId: response.userId })

        chrome.storage.local
          .set({
            accessToken: response.accessToken,
            userId: response.userId,
          })
          .then()
      }
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })
    }
  },

  weekdays: [
    {
      id: 1,
      name: 'Mon',
    },
    {
      id: 2,
      name: 'Tue',
    },
    {
      id: 3,
      name: 'Wed',
    },
    {
      id: 4,
      name: 'Thu',
    },
    {
      id: 5,
      name: 'Fri',
    },
    {
      id: 6,
      name: 'Sat',
    },
    {
      id: 0,
      name: 'Sun',
    },
  ],
}))

export default useAppStore
