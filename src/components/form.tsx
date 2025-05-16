import { TextInput, Group, Container, Stack, Card, Title } from '@mantine/core'
import { useMask } from '@react-input/mask'
import { useState } from 'react'

const Form = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const phoneInputRef = useMask({
    mask: '+1 (___) ___-____',
    replacement: { _: /\d/ }
  })
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
                  placeholder="Enter first name"
                  required
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                />
              </Group>

              <TextInput
                ref={phoneInputRef}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                label="Phone Number"
                placeholder="+1 (555) 555-5555"
                required
              />

              <TextInput
                label="Corporation Number"
                placeholder="Enter corporation number"
                required
              />
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}

export default Form
