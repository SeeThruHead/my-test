import { expect, test } from 'vitest'
import {
  validateCorporationNumber,
  validateSignUpForm
} from './sign-up-form-utils'
import { Either } from 'effect'

test('SignUpFormSchemaFail', async () => {
  const validated = await validateCorporationNumber('123123123')

  const result = Either.map(validated, (validated) => {
    return validateSignUpForm({
      firstName: 'bob',
      lastName: 'coolguy',
      phoneNumber: '1231231233',
      validatedCorporationNumber: validated
    })
  })

  if (Either.isRight(result)) {
    expect(result.right).toBe('the form is valid')
  }
})
