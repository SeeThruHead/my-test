import { TextInput, Group, Container, Stack, Card, Title } from '@mantine/core'
import { useMask } from '@react-input/mask'
import { IconPhone } from '@tabler/icons-react'
import { hasLength, useForm } from '@mantine/form'

const Form = () => {
  const form = useForm({
    mode: 'controlled',
    validateInputOnBlur: true,
    validate: {
      phoneNumber: (v: string) => false,
      firstName: hasLength(
        { min: 1, max: 50 },
        'First name must be between 1-10 characters long'
      ),
      lastName: hasLength(
        { min: 1, max: 50 },
        'Last name must be between 1-10 characters long'
      ),
      corporationNumber: (v: string) =>
        !new RegExp(/\d.*/).test(v)
          ? 'Corporation Number must be a number'
          : !(v.length === 9)
            ? 'Corporation Number must be exactly 9 characters long.'
            : null
    }
  })
  const phoneInputRef = useMask({
    mask: '+1 (___) ___-____',
    replacement: { _: /\d/ }
  })

  console.log(form.getValues())
  console.log(form.errors)
  return (
    <Container size="sm">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center">
            Onboarding Form
          </Title>
          <form>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="First Name"
                  key={form.key('firstName')}
                  placeholder="Enter first name"
                  required
                  {...form.getInputProps('firstName')}
                />
                <TextInput
                  label="Last Name"
                  key={form.key('lastName')}
                  placeholder="Enter last name"
                  required
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

              <TextInput
                label="Corporation Number"
                key={form.key('corporationNumber')}
                placeholder="Enter corporation number"
                required
                {...form.getInputProps('corporationNumber')}
              />
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}

export default Form
