import { renderHook, act, waitFor } from '@testing-library/react-native'
import useBiometricAuth from '../useBiometricAuth'

const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()
const mockAuthenticateAsync = jest.fn()
const mockHasHardwareAsync = jest.fn()
const mockIsEnrolledAsync = jest.fn()
const mockGetBiometricSecret = jest.fn()
const mockIsBiometricEmailMatch = jest.fn()
const mockNormalizeEmail = jest.fn((value) => value?.trim().toLowerCase() || '')
const mockSignInWithEmailAndPassword = jest.fn()

jest.mock('../../../components/Toast/ToastMessage', () => ({
  __esModule: true,
  default: () => ({
    showSuccess: (...args) => mockShowSuccess(...args),
    showError: (...args) => mockShowError(...args),
  }),
}))

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: (...args) => mockHasHardwareAsync(...args),
  isEnrolledAsync: (...args) => mockIsEnrolledAsync(...args),
  authenticateAsync: (...args) => mockAuthenticateAsync(...args),
}))

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
}))

jest.mock('../../../services/firebase', () => ({
  auth: { currentUser: null, signOut: jest.fn() },
}))

jest.mock('../../../services/biometric/biometricStorage', () => ({
  isBiometricEmailMatch: (...args) => mockIsBiometricEmailMatch(...args),
  normalizeEmail: (...args) => mockNormalizeEmail(...args),
  getBiometricSecret: (...args) => mockGetBiometricSecret(...args),
}))

describe('useBiometricAuth', () => {
  const navigation = { replace: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    mockShowSuccess.mockReset()
    mockShowError.mockReset()
    mockAuthenticateAsync.mockReset()
    mockHasHardwareAsync.mockReset()
    mockIsEnrolledAsync.mockReset()
    mockGetBiometricSecret.mockReset()
    mockIsBiometricEmailMatch.mockReset()
    mockNormalizeEmail.mockImplementation((value) => value?.trim().toLowerCase() || '')
    mockSignInWithEmailAndPassword.mockReset()
  })

  it('detecta suporte biométrico no dispositivo', async () => {
    mockHasHardwareAsync.mockResolvedValueOnce(true)
    mockIsEnrolledAsync.mockResolvedValueOnce(true)
    mockIsBiometricEmailMatch.mockResolvedValueOnce(false)

    const { result } = renderHook(() => useBiometricAuth(navigation, 'usuario@exemplo.com'))

    await waitFor(() => expect(result.current.isBiometricAvailable).toBe(true))
  })

  it('bloqueia o uso quando o e-mail não está vinculado à biometria', async () => {
    mockHasHardwareAsync.mockResolvedValueOnce(true)
    mockIsEnrolledAsync.mockResolvedValueOnce(true)
    mockIsBiometricEmailMatch.mockResolvedValueOnce(false)

    const { result } = renderHook(() => useBiometricAuth(navigation, 'usuario@exemplo.com'))

    await act(async () => {
      await result.current.handleBiometricAuth('usuario@exemplo.com')
    })

    expect(mockShowError).toHaveBeenCalledWith(
      'A biometria está vinculada a outro e-mail. Entre com senha para este usuário.',
    )
  })

  it('autentica com biometria, lê a senha salva e navega para o app', async () => {
    mockHasHardwareAsync.mockResolvedValueOnce(true)
    mockIsEnrolledAsync.mockResolvedValueOnce(true)
    mockIsBiometricEmailMatch.mockResolvedValueOnce(true)
    mockAuthenticateAsync.mockResolvedValueOnce({ success: true })
    mockGetBiometricSecret.mockResolvedValueOnce('senha-secreta')
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'user-1' } })

    const { result } = renderHook(() => useBiometricAuth(navigation, 'usuario@exemplo.com'))

    await waitFor(() => expect(result.current.isBiometricEnabledForEmail).toBe(true))

    await act(async () => {
      await result.current.handleBiometricAuth('usuario@exemplo.com')
    })

    expect(mockAuthenticateAsync).toHaveBeenCalledWith({
      promptMessage: 'Autentique para acessar o app',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    })
    expect(mockGetBiometricSecret).toHaveBeenCalledWith('usuario@exemplo.com')
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({ currentUser: null, signOut: expect.any(Function) }),
      'usuario@exemplo.com',
      'senha-secreta',
    )
    expect(navigation.replace).toHaveBeenCalledWith('App')
    expect(mockShowSuccess).toHaveBeenCalledWith('Autenticação bem-sucedida.')
  })

  it('mostra erro quando a autenticação biométrica falha', async () => {
    mockHasHardwareAsync.mockResolvedValueOnce(true)
    mockIsEnrolledAsync.mockResolvedValueOnce(true)
    mockIsBiometricEmailMatch.mockResolvedValueOnce(true)
    mockAuthenticateAsync.mockResolvedValueOnce({ success: false })

    const { result } = renderHook(() => useBiometricAuth(navigation, 'usuario@exemplo.com'))

    await waitFor(() => expect(result.current.isBiometricEnabledForEmail).toBe(true))

    await act(async () => {
      await result.current.handleBiometricAuth('usuario@exemplo.com')
    })

    expect(mockShowError).toHaveBeenCalledWith('Autenticação falhou. Tente novamente.')
  })
})
