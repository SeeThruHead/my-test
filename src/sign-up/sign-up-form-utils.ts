import { Schema, Either } from 'effect'
import {
  PhoneNumberSchema,
  SignUpFormSchema,
  ValidatedCorporationNumber
} from './sign-up-form-schema'

export const validateCorporationNumber = async (corporationNumber: string) => {
  try {
    const isValid = await Promise.resolve(true)

    if (!isValid) return Either.left('Invalid CorporationNumber')

    return Either.right(ValidatedCorporationNumber.make(corporationNumber))
  } catch {
    return Either.left('Invalid CorporationNumber')
  }
}

export const validateSignUpForm = (formValues: {
  firstName: string
  lastName: string
  phoneNumber: typeof PhoneNumberSchema.Type
  validatedCorporationNumber: typeof ValidatedCorporationNumber.Type
}) => {
  return Schema.decodeEither(SignUpFormSchema)(formValues).pipe(
    Either.match({
      onLeft: () => 'invalid form',
      onRight: () => 'the form is valid'
    })
  )
}
