export enum SubscriptionPlan {
  free = 'free',
  pro = 'pro',
}

export interface IAppStore {
  userId: string
  userToken: string
  provider: string
  email: string

  me: IMe | null
  fetchMe: () => Promise<void>

  isSubscriptionEnabled: boolean
  subscriptionPlans: ISubscriptionPlan[]
  resourcesLimitation: IResourcesLimitation
  fetchSubscriptionPlans: () => Promise<void>

  isGeneratingSubscriptionCheckoutURL: boolean
  generateSubscriptionCheckoutURL: (subscriptionId: string) => Promise<string>

  isGettingPaymentCustomerPortalURL: boolean
  getPaymentCustomerPortalURL: () => Promise<string>

  setHabitReminder: (needReminder: boolean) => void
  setTaskReminder: (needReminder: boolean) => void

  isInitializing: boolean
  initSentry: () => void
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
  email: string
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
  id: string
  amount: number
  afterDiscountAmount: number
}

export interface IGetSubscriptionPlansResponse {
  isEnabled: boolean
  plans: ISubscriptionPlan[]
  resourcesLimitation: IResourcesLimitation
}

export interface IGenerateSubscriptionCheckoutURLApiRequest {
  subscriptionId: string
}

export interface IGenerateSubscriptionCheckoutURLApiResponse {
  checkoutUrl: string
}

export interface IPlanLimitation {
  free: number
  pro: number
}

export interface IResourcesLimitation {
  goal: IPlanLimitation
  task: IPlanLimitation
  habit: IPlanLimitation
  note: IPlanLimitation
  qrCode: IPlanLimitation
  highlight: IPlanLimitation
}

export interface IGetPaymentCustomerPortalURLResponse {
  url: string
}
