import { create } from 'zustand'
import {
  IAnonymousSignInApiRequest,
  IAnonymousSignInApiResponse,
  IAppStore,
  IGoogleSignInApiResponse,
} from '@/modules/common/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const useAppStore = create<IAppStore>((set, get) => ({
  userId: '',
  userToken: '',
  provider: '',

  subscription: {
    id: 'free',
    expiry: null,
  },
  fetchSubscription: async () => {
    set({
      subscription: {
        id: 'pro',
        expiry: new Date(new Date().getTime() + 500000000),
      },
    })
  },

  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })

    return new Promise((resolve) => {
      chrome.storage.local.get(async (result) => {
        const userId: string = result.userId || ''
        const accessToken: string = result.accessToken || ''
        const provider: string = result.provider || ''

        if (!userId || !accessToken) {
          // if user id not found, this means the current user is new to the extension
          // call server api to create a new user
          const { anonymousSignIn } = get()
          await anonymousSignIn()
        } else {
          // if user id found, this means current user is returning to the extension
          const { setAccessToken } = useHttpStore.getState()
          setAccessToken(accessToken)

          set({ userId, userToken: accessToken, provider })
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
      set({ userId: response.userId, userToken: response.accessToken })

      const { setAccessToken } = useHttpStore.getState()
      setAccessToken(response.accessToken)

      chrome.storage.local
        .set({
          accessToken: response.accessToken,
          userId: response.userId,
          provider: response.provider,
        })
        .then()
    }
  },

  isGoogleSigningIn: false,
  googleSignIn: async () => {
    set({ isGoogleSigningIn: true })

    const { userToken } = get()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    chrome.runtime.sendMessage(
      {
        userToken,
        type: 'sign-in-with-google',
      },
      async (response: IGoogleSignInApiResponse) => {
        console.log('response', response)

        set({ isGoogleSigningIn: false })
        if (!response.success) {
          showErrorNotification({
            description: response.error,
          })
          return
        }

        set({
          isGoogleSigningIn: false,
          userId: response.userId,
          userToken: response.accessToken,
          provider: response.provider,
        })

        showNotification({
          description: 'Signed in successfully',
        })

        chrome.storage.local
          .set({
            isSignedInSuccessfully: false,
          })
          .then()
      },
    )
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

  signOut: () => {
    set({
      provider: 'extension',
    })
  },
}))

export default useAppStore
