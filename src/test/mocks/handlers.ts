import { delay, http, HttpResponse } from 'msw'

const CORP_NUMBER_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/corporation-number'

export const handlers = [
  http.get(`${CORP_NUMBER_API}/:number`, async ({ params }) => {
    const { number } = params

    if (number === '123456789') {
      return HttpResponse.json({
        valid: true,
        corporationNumber: number
      })
    }

    return HttpResponse.json({
      valid: false,
      message: 'Invalid corporation number'
    })
  })
]
