import { Schema } from 'effect'

const ValidatedCorporationNumberBrand = Symbol.for(
  'ValidatedCorporationNumberBrand'
)

export const ValidatedCorporationNumber = Schema.String.pipe(
  Schema.brand(ValidatedCorporationNumberBrand)
)
export type ValidatedCorporationNumber = typeof ValidatedCorporationNumber.Type

export const ValidateCorpNumberResponse = Schema.Union(
  Schema.Struct({
    valid: Schema.Literal(true),
    corporationNumber: Schema.String
  }),
  Schema.Struct({
    valid: Schema.Literal(false),
    message: Schema.String
  })
)

export type ValidateCorpNumberResponse = typeof ValidatedCorporationNumber.Type
