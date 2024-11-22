export interface IAppStore {
  userId: string
  userToken: string
  provider: string
  subscription: IUserSubscriptionPlan
  fetchSubscription: () => Promise<void>

  isInitializing: boolean
  initApp: () => Promise<void>
  generateAnonymousUserId: (length: number) => string
  createAnonymousSignInChecksum: (anonymousUserId: string) => Promise<string>
  anonymousSignIn: () => Promise<void>

  isGoogleSigningIn: boolean
  googleSignIn: () => Promise<void>

  signOut: () => void

  weekdays: IWeekday[]
}

export interface IAnonymousSignInApiRequest {
  clientId: string
  source: string
  checksum: string
}

export interface IAnonymousSignInApiResponse {
  userId: string
  accessToken: string
  provider: string
}

export interface IGoogleSignInApiResponse {
  success: boolean
  error: string
  userId: string
  accessToken: string
  provider: string
}

export interface IWeekday {
  id: number
  name: string
}

export interface IUserSubscriptionPlan {
  id: string
  expiry: Date | null
}
