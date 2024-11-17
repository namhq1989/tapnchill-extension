export interface IQuote {
  content: string
  author: string
}

export interface IGetQuoteApiResponse {
  quote: IQuote
}

export interface IQuoteStore {
  quote: IQuote | null
  fetchQuote: () => Promise<void>
}
