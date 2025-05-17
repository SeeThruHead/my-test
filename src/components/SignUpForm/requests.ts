import { Schema } from 'effect'
import { ValidatedCorporationNumber } from './schema'

const CORP_NUMBER_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/corporation-number'
const PROFILE_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/profile-details'

import { ValidateCorpNumberResponse } from './schema'

const validateErrorMessage =
  "There's been an issue validating your Corporation Number, Please contact support"
export const validateCorpNumberWithApi = async (number: string) => {
  try {
    const response = await fetch(`${CORP_NUMBER_API}/${number}`)
    const rawBody: unknown = await response.json()

    if (response.status === 404 || response.ok) {
      const body = Schema.decodeUnknownSync(ValidateCorpNumberResponse)(rawBody)

      if (!body.valid) {
        throw new Error(body.message || 'Invalid corporation number')
      }
      return body.corporationNumber
    }

    throw new Error(validateErrorMessage)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(validateErrorMessage)
  }
}
// 123456789

const formatPhoneForSubmission = (phone: string) => {
  return phone.startsWith('+')
    ? '+' + phone.slice(1).replace(/\D/g, '')
    : phone.replace(/\D/g, '')
}

export const submitForm = async (values: {
  firstName: string
  lastName: string
  corporationNumber: ValidatedCorporationNumber
  phone: string
}) => {
  const response = await fetch(PROFILE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...values,
      phone: formatPhoneForSubmission(values.phone)
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      error.message ||
        "There's been an issue signing you up, Please contact support"
    )
  }

  return true
}
