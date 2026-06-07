// Suíte do fluxo de login: cobre validação, carregamento do firstLogin e sucesso assíncrono com persistência local.
import { renderHook, act, waitFor } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useLogin from '../useLogin'

const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()
const mockSignInWithEmailAndPassword = jest.fn()
const mockGetUserByEmail = jest.fn()
const mockMarkUserFirstLoginAsCompleted = jest.fn()
const mockSaveBiometricEmail = jest.fn()
const mockSaveBiometricSecret = jest.fn()

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}))

jest.mock('../../../components/Toast/ToastMessage', () => ({
  __esModule: true,
  default: () => ({
    showSuccess: (...args) => mockShowSuccess(...args),
    showError: (...args) => mockShowError(...args),
  }),
}))

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
}))

jest.mock('../../../services/firebase', () => ({
  auth: { mocked: true },
}))

jest.mock('../../../services/users/userService', () => ({
  getUserByEmail: (...args) => mockGetUserByEmail(...args),
  markUserFirstLoginAsCompleted: (...args) => mockMarkUserFirstLoginAsCompleted(...args),
}))

jest.mock('../../../services/biometric/biometricStorage', () => ({
  saveBiometricEmail: (...args) => mockSaveBiometricEmail(...args),
  saveBiometricSecret: (...args) => mockSaveBiometricSecret(...args),
}))

describe('useLogin', () => {
  const navigation = { replace: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    mockShowSuccess.mockReset()
    mockShowError.mockReset()
    mockSignInWithEmailAndPassword.mockReset()
    mockGetUserByEmail.mockReset()
    mockMarkUserFirstLoginAsCompleted.mockReset()
    mockSaveBiometricEmail.mockReset()
    mockSaveBiometricSecret.mockReset()
    AsyncStorage.setItem.mockReset()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('mantém firstLogin sincronizado com o registro do usuário', async () => {
    mockGetUserByEmail.mockResolvedValueOnce({ firstLogin: false })

    const { result } = renderHook(() => useLogin(navigation, ' usuario@exemplo.com '))

    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => expect(result.current.firstLogin).toBe(false))
  })

  it('interrompe o login quando a validação falha', async () => {
    const { result } = renderHook(() => useLogin(navigation, ''))

    await act(async () => {
      await result.current.handleLogin('invalido', '123')
    })

    expect(mockSignInWithEmailAndPassword).not.toHaveBeenCalled()
    expect(mockShowError).toHaveBeenCalledWith('E-mail inválido')
  })

  it('autentica, persiste dados e navega para o app', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'user-1' } })
    mockMarkUserFirstLoginAsCompleted.mockResolvedValueOnce(true)
    mockSaveBiometricEmail.mockResolvedValueOnce(undefined)
    mockSaveBiometricSecret.mockResolvedValueOnce(undefined)
    AsyncStorage.setItem.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useLogin(navigation, 'usuario@exemplo.com'))

    await act(async () => {
      await result.current.handleLogin(' usuario@exemplo.com ', 'abc123')
    })

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({ mocked: true }),
      'usuario@exemplo.com',
      'abc123',
    )
    expect(mockMarkUserFirstLoginAsCompleted).toHaveBeenCalledWith('user-1', 'usuario@exemplo.com')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('lastEmail', 'usuario@exemplo.com')
    expect(mockSaveBiometricEmail).toHaveBeenCalledWith('usuario@exemplo.com')
    expect(mockSaveBiometricSecret).toHaveBeenCalledWith('usuario@exemplo.com', 'abc123')
    expect(mockShowSuccess).toHaveBeenCalledWith('Autenticado com sucesso.')
    expect(navigation.replace).toHaveBeenCalledWith('App')
  })

  it('mostra erro amigável quando o Firebase rejeita o login', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('falha'))
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useLogin(navigation, 'usuario@exemplo.com'))

    await act(async () => {
      await result.current.handleLogin('usuario@exemplo.com', 'abc123')
    })

    expect(mockShowError).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
