export interface IHighlight {
  url: string
  numOfHighlights: number
}

export interface IHighlightStore {
  highlights: IHighlight[]
  initHighlights: () => void
}
