import { Schema, Either } from 'effect'
import {
  SignUpFormSchema,
  ValidatedCorporationNumber
} from './sign-up-form-schema'

export const validateCorporationNumber = async (corporationNumber: string) => {
  try {
    const isValid = await Promise.resolve(true)

    if (!isValid) {
      throw new Error('Invalid corporation number')
    }

    return Either.right(ValidatedCorporationNumber.make(corporationNumber))
  } catch {
    return Either.left('Invalid CorporationNumber')
  }
}

export const validateSignUpForm = (formValues: {
  firstName: string
  lastName: string
  phoneNumber: string
  validatedCorporationNumber: typeof ValidatedCorporationNumber.Type
}) => {
  return Schema.decodeEither(SignUpFormSchema)(formValues).pipe(
    Either.match({
      onLeft: () => 'invalid form',
      onRight: () => `the form is valid`
    })
  )
}
