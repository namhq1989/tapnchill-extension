export interface IPanelStore {
  isInitializing: boolean
  initApp: () => Promise<void>
}
