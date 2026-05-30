// Suíte do fluxo de cadastro: cobre validação local, sucesso de cadastro e erros mapeados.
import { renderHook, act } from '@testing-library/react-native'
import useRegister from '../useRegister'

const mockRegisterUserInFirebase = jest.fn()
const mockHandleFirebaseError = jest.fn()
const mockToastShow = jest.fn()

jest.mock('react-native-toast-message', () => ({
  show: (...args) => mockToastShow(...args),
}))

jest.mock('../../../services/auth/registerUser', () => ({
  registerUserInFirebase: (...args) => mockRegisterUserInFirebase(...args),
}))

jest.mock('../../../services/validations/firebaseErrorHandler', () => ({
  handleFirebaseError: (...args) => mockHandleFirebaseError(...args),
}))

describe('useRegister', () => {
  const navigation = { navigate: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRegisterUserInFirebase.mockReset()
    mockHandleFirebaseError.mockReset()
    mockToastShow.mockReset()
  })

  it('interrompe o cadastro quando a validação falha', async () => {
    const { result } = renderHook(() => useRegister(navigation))

    await act(async () => {
      await result.current.handleRegister({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    })

    expect(mockRegisterUserInFirebase).not.toHaveBeenCalled()
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro de validação',
      text2: 'Usuário é obrigatório',
    })
  })

  it('cadastra e navega quando o serviço conclui com sucesso', async () => {
    mockRegisterUserInFirebase.mockResolvedValueOnce({ user: { uid: 'user-1' } })
    const { result } = renderHook(() => useRegister(navigation))

    await act(async () => {
      await result.current.handleRegister({
        username: 'rota',
        email: 'novo@exemplo.com',
        password: 'abc123',
        confirmPassword: 'abc123',
      })
    })

    expect(mockRegisterUserInFirebase).toHaveBeenCalledWith({
      username: 'rota',
      email: 'novo@exemplo.com',
      password: 'abc123',
    })
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Conta criada 🎉',
    })
    expect(navigation.navigate).toHaveBeenCalledWith('Auth', { email: 'novo@exemplo.com' })
  })

  it('mapeia erro do serviço para a mensagem exibida', async () => {
    mockRegisterUserInFirebase.mockRejectedValueOnce(new Error('falha bruta'))
    mockHandleFirebaseError.mockReturnValueOnce({ message: 'Falha amigável' })
    const { result } = renderHook(() => useRegister(navigation))

    await act(async () => {
      await result.current.handleRegister({
        username: 'rota',
        email: 'erro@exemplo.com',
        password: 'abc123',
        confirmPassword: 'abc123',
      })
    })

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha amigável',
    })
  })
})
