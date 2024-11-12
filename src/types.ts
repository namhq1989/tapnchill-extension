export interface IAppStore {
  userId: string
  initApp: () => Promise<void>
  generateAnonymousUserId: (length: number) => string
  createAnonymousSignUpChecksum: (anonymousUserId: string) => Promise<string>
  anonymousSignUp: () => Promise<void>
}

export interface IAnonymousSignUpApiRequest {
  clientId: string
  source: string
  checksum: string
}

export interface IAnonymousSignUpApiResponse {
  accessToken: string
}
