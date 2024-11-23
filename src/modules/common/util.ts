import { IGetMeResponse, IMe } from '@/modules/common/types.ts'

const mapMe = (apiData: IGetMeResponse): IMe => {
  return {
    ip: apiData.ip,
    subscription: {
      plan: apiData.subscription.plan,
      expiry: apiData.subscription.expiry
        ? new Date(apiData.subscription.expiry)
        : null,
    },
  }
}

export { mapMe }
