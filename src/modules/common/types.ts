export interface IAppStore {
  userId: string
  userToken: string
  provider: string
  me: IMe | null
  fetchMe: () => Promise<void>

  subscriptionPlans: ISubscriptionPlan[]
  fetchSubscriptionPlans: () => Promise<void>

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

export interface IMe {
  ip: string
  subscription: IUserSubscription
}

export interface IGetMeResponse {
  ip: string
  subscription: IUserSubscriptionApiData
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

export interface IUserSubscription {
  plan: string
  expiry: Date | null
}

export interface IUserSubscriptionApiData {
  plan: string
  expiry: string
}

export interface ISubscriptionPlan {
  periodText: string
  priceId: string
  amount: number
  discountId: string
  afterDiscountAmount: number
  token: string
}

export interface IGetSubscriptionPlansResponse {
  plans: ISubscriptionPlan[]
}
