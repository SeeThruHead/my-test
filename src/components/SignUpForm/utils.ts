import { useMask } from '@react-input/mask'

export const usePhoneMaskRef = () =>
  useMask({
    mask: '+1 (___) ___-____',
    replacement: { _: /\d/ }
  })

export const useDigitLenghMaskRef = (length: number) =>
  useMask({
    mask: Array(length).fill('_').join(''),
    replacement: { _: /\d/ }
  })

export const PHONE_REGEX = /^\+1 \(\d{3}\) \d{3}-\d{4}$/
export const validatePhoneNumber = (value: string) => {
  if (!value) return 'Phone number is required'
  if (!PHONE_REGEX.test(value)) {
    return 'Phone number must be in format: +1 (555) 555-5555'
  }
  return null
}

export const validateCorporationNumber = (value: string) => {
  if (!value) return 'Corporation number is required'
  if (!/^\d+$/.test(value)) return 'Corporation number must contain only digits'
  if (value.length !== 9) return 'Corporation number must be exactly 9 digits'
  return null
}
