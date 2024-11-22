export interface IAppStore {
  userId: string
  isInitializing: boolean
  initApp: () => Promise<void>
  generateAnonymousUserId: (length: number) => string
  createAnonymousSignInChecksum: (anonymousUserId: string) => Promise<string>
  anonymousSignIn: () => Promise<void>
  googleSignIn: (token: string) => Promise<void>

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
}

export interface IGoogleSignInApiRequest {
  token: string
}

export interface IGoogleSignInApiResponse {
  userId: string
  accessToken: string
}

export interface IWeekday {
  id: number
  name: string
}
