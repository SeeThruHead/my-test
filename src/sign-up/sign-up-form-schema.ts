import { Schema } from 'effect'

const ValidatedCorporationNumberBrand = Symbol.for(
  'ValidatedCorporationNumberBrand'
)
export const ValidatedCorporationNumber = Schema.String.pipe(
  Schema.brand(ValidatedCorporationNumberBrand)
)

export const SignUpFormSchema = Schema.Struct({
  firstName: Schema.Trim.pipe(Schema.maxLength(50)),
  lastName: Schema.Trim.pipe(Schema.maxLength(50)),
  phoneNumber: Schema.Trim.pipe(Schema.length(10), Schema.brand('phoneNumber')),
  validatedCorporationNumber: Schema.compose(
    Schema.Trim,
    ValidatedCorporationNumber
  )
})
