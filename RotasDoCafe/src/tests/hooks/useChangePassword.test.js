import { renderHook, act } from '@testing-library/react-native'
import useChangePassword from '../../hooks/ProfileScreen/useChangePassword'

const mockToastShow = jest.fn()
const mockReauthenticate = jest.fn()
const mockUpdatePassword = jest.fn()
const mockCredential = jest.fn()
const mockSaveBiometricSecret = jest.fn()

jest.mock('react-native-toast-message', () => ({
  show: (...args) => mockToastShow(...args),
}))

jest.mock('firebase/auth', () => ({
  EmailAuthProvider: {
    credential: (...args) => mockCredential(...args),
  },
  reauthenticateWithCredential: (...args) => mockReauthenticate(...args),
  updatePassword: (...args) => mockUpdatePassword(...args),
}))

jest.mock('../../services/firebase', () => ({
  auth: {
    currentUser: {
      email: 'usuario@exemplo.com',
    },
  },
}))

jest.mock('../../services/biometric/biometricStorage', () => ({
  saveBiometricSecret: (...args) => mockSaveBiometricSecret(...args),
}))

describe('useChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mostra erro quando existem campos de senha incompletos', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: '',
        newPassword: '123456',
        confirmPassword: '',
      })
    })

    expect(mockReauthenticate).not.toHaveBeenCalled()
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'Preencha todos os campos da senha.',
    })
  })

  it('mostra erro quando a confirmação não confere', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: 'novaSenha',
        confirmPassword: 'outraSenha',
      })
    })

    expect(mockUpdatePassword).not.toHaveBeenCalled()
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'As senhas não coincidem.',
    })
  })

  it('troca a senha com sucesso', async () => {
    mockCredential.mockReturnValue('credential')

    const onSuccess = jest.fn()

    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: 'novaSenha',
        confirmPassword: 'novaSenha',
        onSuccess,
      })
    })

    expect(mockCredential).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      'senhaAtual'
    )

    expect(mockReauthenticate).toHaveBeenCalled()
    expect(mockUpdatePassword).toHaveBeenCalled()
    expect(mockSaveBiometricSecret).toHaveBeenCalledWith(
      'usuario@exemplo.com',
      'novaSenha'
    )

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Senha alterada com sucesso',
    })

    expect(onSuccess).toHaveBeenCalled()
  })
})