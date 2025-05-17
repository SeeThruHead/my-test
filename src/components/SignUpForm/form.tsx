import {
  TextInput,
  Group,
  Container,
  Stack,
  Card,
  Title,
  Loader,
  Button,
  Alert
} from '@mantine/core'
import { IconPhone, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { hasLength, useForm } from '@mantine/form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { validateCorpNumberWithApi, submitForm } from './requests'
import {
  validatePhoneNumber,
  validateCorporationNumber,
  useDigitLenghMaskRef,
  usePhoneMaskRef
} from './utils'
import { ValidatedCorporationNumber } from './schema'

export const useOnboardingForm = () => {
  const [validatedCorpNumber, setValidatedCorpNumber] =
    useState<ValidatedCorporationNumber | null>(null)

  const form = useForm({
    initialValues: {
      phone: '',
      firstName: '',
      lastName: '',
      corporationNumber: ''
    },
    mode: 'controlled',
    validateInputOnChange: false,
    validateInputOnBlur: true,
    validate: {
      phone: validatePhoneNumber,
      firstName: hasLength(
        { min: 1, max: 50 },
        'First name must be between 1-50 characters long'
      ),
      lastName: hasLength(
        { min: 1, max: 50 },
        'Last name must be between 1-50 characters long'
      ),
      corporationNumber: validateCorporationNumber
    }
  })

  const phoneInputRef = usePhoneMaskRef()
  const corporationNumberRef = useDigitLenghMaskRef(9)

  const corpNumber = form.values.corporationNumber
  const corpNumberError = form.errors.corporationNumber

  const { error, isSuccess, isFetching } = useQuery({
    queryKey: ['validateCorporationNumber', corpNumber],
    queryFn: async () => {
      const result = await validateCorpNumberWithApi(corpNumber)
      console.log('result')
      console.log(result)
      if (result) {
        console.log('setting validated corp number')
        // Only set validated number if API validation succeeds
        const validated = ValidatedCorporationNumber.make(corpNumber)
        setValidatedCorpNumber(validated)
      }
      return result
    },
    enabled: Boolean(corpNumber) && corpNumber.length === 9 && !corpNumberError,
    retry: false,
    refetchOnMount: false
  })

  const {
    mutate,
    isPending: isSubmitting,
    error: submitError,
    isSuccess: isSubmitSuccess
  } = useMutation({
    mutationFn: submitForm,
    onError: (error: Error) => {
      form.setErrors({ submit: error.message })
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    if (!validatedCorpNumber) return

    mutate({
      ...values,
      corporationNumber: validatedCorpNumber
    })
  }

  useEffect(() => {
    if (error && form.isTouched('corporationNumber')) {
      form.setFieldError(
        'corporationNumber',
        error instanceof Error ? error.message : error
      )
    }
  }, [error, form])

  const isFormValid =
    form.isValid() && !error && !isFetching && Boolean(validatedCorpNumber)

  console.log(validatedCorpNumber)

  return {
    form,
    phoneInputRef,
    corporationNumberRef,
    isValidatingCorpNumber: isFetching,
    isValidCorporationNumber: isSuccess && !error,
    submitError: submitError?.message || null,
    isSubmitting,
    handleSubmit,
    isFormValid,
    isSubmitSuccess,
    validatedCorpNumber
  }
}

const Form = () => {
  const {
    form,
    phoneInputRef,
    corporationNumberRef,
    isValidatingCorpNumber,
    isValidCorporationNumber,
    submitError,
    isSubmitting,
    handleSubmit,
    isFormValid,
    isSubmitSuccess
  } = useOnboardingForm()

  return (
    <Container size="sm">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center">
            Onboarding Form
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Group grow align="flex-start">
                <TextInput
                  label="First Name"
                  key={form.key('firstName')}
                  placeholder="Enter first name"
                  required
                  inputWrapperOrder={['label', 'input', 'error']}
                  {...form.getInputProps('firstName')}
                />
                <TextInput
                  label="Last Name"
                  key={form.key('lastName')}
                  placeholder="Enter last name"
                  required
                  inputWrapperOrder={['label', 'input', 'error']}
                  {...form.getInputProps('lastName')}
                />
              </Group>

              <TextInput
                leftSection={<IconPhone size={18} />}
                ref={phoneInputRef}
                key={form.key('phone')}
                label="Phone Number"
                placeholder="+1 (555) 555-5555"
                required
                {...form.getInputProps('phone')}
              />

              <TextInput
                ref={corporationNumberRef}
                label="Corporation Number"
                key={form.key('corporationNumber')}
                placeholder="Enter corporation number"
                required
                rightSection={
                  isValidatingCorpNumber ? (
                    <Loader size="xs" />
                  ) : isValidCorporationNumber ? (
                    <IconCheck size={18} color="green" />
                  ) : null
                }
                {...form.getInputProps('corporationNumber')}
              />

              {submitError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error"
                  color="red"
                  variant="filled"
                >
                  {submitError}
                </Alert>
              )}

              {isSubmitSuccess && (
                <Alert
                  icon={<IconCheck size={16} />}
                  title="Success"
                  color="green"
                  variant="filled"
                >
                  Form submitted successfully!
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isSubmitting}
                disabled={!isFormValid}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}

export default Form
