import { useMask } from '@react-input/mask'
import OnboardingForm from './components/form'

function App() {
  const phoneInputRef = useMask({
    mask: '+1 (___) ___-____',
    replacement: { _: /\d/ }
  })

  return (
    <div
      style={{
        backgroundColor: '#f1f3f5',
        minHeight: '100vh',
        paddingTop: '2rem'
      }}
    >
      <OnboardingForm />
    </div>
  )
}

export default App
