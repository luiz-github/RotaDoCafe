import { renderHook, act } from '@testing-library/react-native'
import useForgotPassword from '../../hooks/AuthScreen/useForgotPassword'

const mockSendResetEmail = jest.fn()
const mockToastShow = jest.fn()

jest.mock('react-native-toast-message', () => ({
  show: (...args) => mockToastShow(...args),
}))

jest.mock('../../services/auth/forgotPassword', () => ({
  sendResetEmail: (...args) => mockSendResetEmail(...args),
}))

jest.mock('../../services/validations/loginValidation', () => ({
  validateEmail: (email) => {
    if (!email || typeof email !== 'string' || !email.trim())
      return { isValid: false, error: 'E-mail é obrigatório' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return { isValid: false, error: 'E-mail inválido' }
    return { isValid: true, error: null }
  },
}))

describe('useForgotPassword', () => {
  const navigation = { goBack: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSendResetEmail.mockReset()
    mockToastShow.mockReset()
  })

  it('bloqueia e-mail inválido sem chamar o serviço', async () => {
    const { result } = renderHook(() => useForgotPassword(navigation))

    await act(async () => {
      await result.current.handleForgotPassword('invalido')
    })

    expect(mockSendResetEmail).not.toHaveBeenCalled()
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Campo inválido',
      text2: 'E-mail inválido',
    })
  })

  it('volta para a tela anterior após envio bem-sucedido', async () => {
    mockSendResetEmail.mockResolvedValueOnce({ success: true })
    const { result } = renderHook(() => useForgotPassword(navigation))

    await act(async () => {
      await result.current.handleForgotPassword('usuario@exemplo.com')
    })

    expect(mockSendResetEmail).toHaveBeenCalledWith('usuario@exemplo.com')
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'success',
      text1: 'E-mail enviado 📩',
      text2: 'Verifique sua caixa de entrada',
    })
  })

  it('mostra o erro retornado pelo serviço', async () => {
    mockSendResetEmail.mockResolvedValueOnce({ success: false, message: 'Falha controlada' })
    const { result } = renderHook(() => useForgotPassword(navigation))

    await act(async () => {
      await result.current.handleForgotPassword('usuario@exemplo.com')
    })

    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Erro ao enviar e-mail',
      text2: 'Falha controlada',
    })
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})
