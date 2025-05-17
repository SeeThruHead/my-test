import { describe, it, expect } from 'vitest'
import {
  PHONE_REGEX,
  validatePhoneNumber,
  validateCorporationNumber
} from './utils'

describe('PHONE_REGEX', () => {
  it('should match valid phone numbers', () => {
    expect(PHONE_REGEX.test('+1 (555) 555-5555')).toBe(true)
    expect(PHONE_REGEX.test('+1 (123) 456-7890')).toBe(true)
  })

  it('should not match invalid phone numbers', () => {
    expect(PHONE_REGEX.test('555-555-5555')).toBe(false)
    expect(PHONE_REGEX.test('(555) 555-5555')).toBe(false)
    expect(PHONE_REGEX.test('+1 555-555-5555')).toBe(false)
    expect(PHONE_REGEX.test('+1 (555)555-5555')).toBe(false)
  })
})

describe('validatePhoneNumber', () => {
  it('should return error for empty value', () => {
    expect(validatePhoneNumber('')).toBe('Phone number is required')
  })

  it('should return error for invalid format', () => {
    expect(validatePhoneNumber('123-456-7890')).toBe(
      'Phone number must be in format: +1 (555) 555-5555'
    )
  })

  it('should return null for valid phone number', () => {
    expect(validatePhoneNumber('+1 (555) 555-5555')).toBe(null)
  })
})

describe('validateCorporationNumber', () => {
  it('should return error for empty value', () => {
    expect(validateCorporationNumber('')).toBe('Corporation number is required')
  })

  it('should return error for non-digit characters', () => {
    expect(validateCorporationNumber('12345678a')).toBe(
      'Corporation number must contain only digits'
    )
  })

  it('should return error for wrong length', () => {
    expect(validateCorporationNumber('12345678')).toBe(
      'Corporation number must be exactly 9 digits'
    )
    expect(validateCorporationNumber('1234567890')).toBe(
      'Corporation number must be exactly 9 digits'
    )
  })

  it('should return null for valid corporation number', () => {
    expect(validateCorporationNumber('123456789')).toBe(null)
  })
})
