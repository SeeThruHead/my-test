import {
  TextInput,
  Group,
  Container,
  Stack,
  Card,
  Title,
  Loader
} from '@mantine/core'
import { useMask } from '@react-input/mask'
import { IconPhone, IconCheck } from '@tabler/icons-react'
import { hasLength, useForm } from '@mantine/form'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDebouncedValue } from '@mantine/hooks'

const CORP_NUMBER_API =
  'https://fe-hometask-api.qa.vault.tryvault.com/corporation-number'

const validateCorpNumberWithApi = async (number: string) => {
  const response = await fetch(`${CORP_NUMBER_API}/${number}`)
  if (!response.ok) {
    throw new Error('Invalid corporation number')
  }
  return null
}

const PHONE_REGEX = /^\+1 \(\d{3}\) \d{3}-\d{4}$/

export const validatePhoneNumber = (value: string) => {
  if (!value) return 'Phone number is required'
  if (!PHONE_REGEX.test(value)) {
    return 'Phone number must be in format: +1 (555) 555-5555'
  }
  return null
}

export const useOnboardingForm = () => {
  const form = useForm({
    mode: 'controlled',
    validateInputOnBlur: true,
    validate: {
      phoneNumber: validatePhoneNumber,
      firstName: hasLength(
        { min: 1, max: 50 },
        'First name must be between 1-50 characters long'
      ),
      lastName: hasLength(
        { min: 1, max: 50 },
        'Last name must be between 1-50 characters long'
      ),
      corporationNumber: (value: string) => false
    }
  })

  const phoneInputRef = useMask({
    mask: '+1 (___) ___-____',
    replacement: { _: /\d/ }
  })

  const corporationNumberRef = useMask({
    mask: '_________',
    replacement: { _: /\d/ }
  })

  const corpNumber = form.values.corporationNumber
  const [debouncedCorpNumber] = useDebouncedValue(corpNumber, 500)

  const {
    error,
    isFetching: isValidatingCorpNumber,
    isSuccess
  } = useQuery({
    queryKey: ['validateCorporationNumber', debouncedCorpNumber],
    queryFn: async () => {
      if (!debouncedCorpNumber) return 'Corporation number is required'
      if (!/^\d+$/.test(debouncedCorpNumber))
        return 'Corporation number must contain only digits'
      if (debouncedCorpNumber.length !== 9)
        return 'Corporation number must be exactly 9 digits'

      return validateCorpNumberWithApi(debouncedCorpNumber)
    },
    enabled: Boolean(debouncedCorpNumber),
    retry: false
  })

  useEffect(() => {
    if (error) {
      form.setFieldError(
        'corporationNumber',
        error instanceof Error ? error.message : error
      )
    }
  }, [error, form])

  return {
    form,
    phoneInputRef,
    corporationNumberRef,
    isValidatingCorpNumber,
    isValidCorporationNumber: isSuccess && !error
  }
}

const CorporationNumberInput = ({
  form,
  inputRef,
  isValidating,
  isValid
}: {
  form: ReturnType<typeof useForm>
  inputRef: ReturnType<typeof useMask>
  isValidating: boolean
  isValid: boolean
}) => (
  <TextInput
    ref={inputRef}
    label="Corporation Number"
    key={form.key('corporationNumber')}
    placeholder="Enter corporation number"
    required
    rightSection={
      isValidating ? (
        <Loader size="xs" />
      ) : isValid ? (
        <IconCheck size={18} color="green" />
      ) : null
    }
    {...form.getInputProps('corporationNumber')}
  />
)

const Form = () => {
  const {
    form,
    phoneInputRef,
    corporationNumberRef,
    isValidatingCorpNumber,
    isValidCorporationNumber
  } = useOnboardingForm()

  return (
    <Container size="sm">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center">
            Onboarding Form
          </Title>
          <form>
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
                key={form.key('phoneNumber')}
                label="Phone Number"
                placeholder="+1 (555) 555-5555"
                required
                {...form.getInputProps('phoneNumber')}
              />

              <CorporationNumberInput
                form={form}
                inputRef={corporationNumberRef}
                isValidating={isValidatingCorpNumber}
                isValid={isValidCorporationNumber}
              />
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}

export default Form
