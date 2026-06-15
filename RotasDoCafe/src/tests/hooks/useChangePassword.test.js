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

    mockCredential.mockReturnValue('credential')
    mockReauthenticate.mockResolvedValue(undefined)
    mockUpdatePassword.mockResolvedValue(undefined)
    mockSaveBiometricSecret.mockResolvedValue(undefined)
  })

  it('mostra erro quando a senha atual não é informada', async () => {
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
      text2: 'Informe sua senha atual.',
    })
  })

  it('mostra erro quando a nova senha não é informada', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: '',
        confirmPassword: '123456',
      })
    })

    expect(mockUpdatePassword).not.toHaveBeenCalled()

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'Informe a nova senha.',
    })
  })

  it('mostra erro quando a confirmação da senha não é informada', async () => {
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: '123456',
        confirmPassword: '',
      })
    })

    expect(mockUpdatePassword).not.toHaveBeenCalled()

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'Confirme a nova senha.',
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
    const onSuccess = jest.fn()

    const { result } = renderHook(() => useChangePassword())

    let response

    await act(async () => {
      response = await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: 'novaSenha',
        confirmPassword: 'novaSenha',
        onSuccess,
      })
    })

    expect(response).toBe(true)

    expect(mockCredential).toHaveBeenCalledWith('usuario@exemplo.com', 'senhaAtual')

    expect(mockReauthenticate).toHaveBeenCalled()

    expect(mockUpdatePassword).toHaveBeenCalled()

    expect(mockSaveBiometricSecret).toHaveBeenCalledWith('usuario@exemplo.com', 'novaSenha')

    expect(onSuccess).toHaveBeenCalled()

    expect(mockToastShow).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    )
  })

  it('mostra erro quando a senha atual está incorreta', async () => {
    mockReauthenticate.mockRejectedValue({
      code: 'auth/invalid-credential',
    })

    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaErrada',
        newPassword: 'novaSenha',
        confirmPassword: 'novaSenha',
      })
    })

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Senha incorreta',
      text2: 'A senha atual informada não confere.',
    })
  })

  it('mostra erro genérico quando ocorre uma falha inesperada', async () => {
    mockUpdatePassword.mockRejectedValue(new Error('Erro inesperado'))

    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.handleSave({
        currentPassword: 'senhaAtual',
        newPassword: 'novaSenha',
        confirmPassword: 'novaSenha',
      })
    })

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha ao salvar dados.',
    })
  })

  it('retorna true quando nenhuma senha é informada', async () => {
    const { result } = renderHook(() => useChangePassword())

    let response

    await act(async () => {
      response = await result.current.handleSave({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    })

    expect(response).toBe(true)

    expect(mockReauthenticate).not.toHaveBeenCalled()
    expect(mockUpdatePassword).not.toHaveBeenCalled()
    expect(mockSaveBiometricSecret).not.toHaveBeenCalled()
  })
})
