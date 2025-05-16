import { Schema } from 'effect'

const ValidatedCorporationNumberBrand = Symbol.for(
  'ValidatedCorporationNumberBrand'
)
export const ValidatedCorporationNumber = Schema.String.pipe(
  Schema.brand(ValidatedCorporationNumberBrand)
)

export const PhoneNumberSchema = Schema.Trim.pipe(
  Schema.pattern(new RegExp(/^\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/))
)

export const SignUpFormSchema = Schema.Struct({
  firstName: Schema.Trim.pipe(Schema.maxLength(50)),
  lastName: Schema.Trim.pipe(Schema.maxLength(50)),
  phoneNumber: PhoneNumberSchema,
  // this should probably be the schema for the signup api, not the form, validation
  validatedCorporationNumber: Schema.compose(
    Schema.Trim,
    ValidatedCorporationNumber
  )
})
