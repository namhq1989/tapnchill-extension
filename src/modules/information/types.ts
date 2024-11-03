export interface IInformationStore {
  isFeedbackSending: boolean
  sendFeedback: (data: IFeedbackFormData) => Promise<boolean>
}

export interface IFeedbackFormData {
  email: string
  feedback: string
}

export interface ISendFeedbackApiResponse {
  ok: boolean
}
