import { Schema } from 'effect'
import { ValidatedCorporationNumber } from './schema'

const CORP_NUMBER_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/corporation-number'
const PROFILE_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/profile-details'

import { ValidateCorpNumberResponse } from './schema'

export const validateCorpNumberWithApi = async (number: string) => {
  try {
    const response = await fetch(`${CORP_NUMBER_API}/${number}`)
    const rawBody: unknown = await response.json()
    const body = Schema.decodeUnknownSync(ValidateCorpNumberResponse)(rawBody)

    if (!body.valid) {
      throw new Error(body.message || 'Invalid corporation number')
    }
    return body.corporationNumber
  } catch {
    throw new Error('Trouble connecting to the api service')
  }
}

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
    throw new Error(error.message || 'Failed to submit form')
  }

  return true
}
