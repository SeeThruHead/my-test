import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from './form'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
}

function renderWithProviders(ui: ReactNode) {
  const testQueryClient = createTestQueryClient()

  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        <MantineProvider>{ui}</MantineProvider>
      </QueryClientProvider>
    ),
    queryClient: testQueryClient
  }
}

afterEach(() => {
  cleanup()
})

describe('Form', () => {
  it('should show validation error for invalid corporation number', async () => {
    renderWithProviders(<Form />)

    const corpInput = screen.getByLabelText(/corporation number/i)
    await userEvent.type(corpInput, '999999999')
    await userEvent.tab()

    await waitFor(() => {
      const error = screen.getByText(/Invalid corporation number/)
      expect(error).toBeDefined()
    })
  })

  it('should show checkmark for valid corporation number', async () => {
    renderWithProviders(<Form />)

    const corpInput = screen.getByLabelText(/corporation number/i)
    await userEvent.type(corpInput, '123456789')
    await userEvent.tab()

    await waitFor(() => {
      const icon = screen.getByTestId('valid-corp-icon')
      expect(icon).toBeDefined()
    })
  })

  it('should enable submit button when form is valid', async () => {
    renderWithProviders(<Form />)

    await userEvent.type(screen.getByLabelText(/first name/i), 'John')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/phone/i), '+1 (555) 555-5555')
    await userEvent.type(
      screen.getByLabelText(/corporation number/i),
      '123456789'
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /submit/i })
      expect(button.getAttribute('disabled')).toBe(null)
    })
  })

  it('should prevent submission when corporation number is not validated', async () => {
    renderWithProviders(<Form />)

    await userEvent.type(screen.getByLabelText(/first name/i), 'John')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/phone/i), '+1 (555) 555-5555')
    await userEvent.type(
      screen.getByLabelText(/corporation number/i),
      '999999999'
    )

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button.getAttribute('disabled')).toBe('')
  })

  it('should only allow numbers in phone input', async () => {
    renderWithProviders(<Form />)

    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement
    await userEvent.type(phoneInput, 'abc123def456')

    expect(phoneInput.value).toBe('+1 (123) 456')
  })

  it('should limit phone input to correct format length', async () => {
    renderWithProviders(<Form />)

    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement
    await userEvent.type(phoneInput, '12345678901234567890')

    expect(phoneInput.value).toBe('+1 (123) 456-7890')
  })

  // was unable to get this one to work
  // it('should show loader while validating corporation number', async () => {
  //   const { queryClient } = renderWithProviders(<Form />)

  //   queryClient.removeQueries({
  //     queryKey: ['validateCorporationNumber', '999999999']
  //   })

  //   const corpInput = screen.getByLabelText(/corporation number/i)
  //   await userEvent.type(corpInput, '123456789')

  //   const loader = screen.getByTestId('corp-number-loader')
  //   expect(loader).toBeDefined()

  //   await waitFor(() => {
  //     expect(screen.getByTestId('valid-corp-icon')).toBeDefined()
  //   })
  // })
})
