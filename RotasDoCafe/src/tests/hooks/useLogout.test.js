import { Alert } from 'react-native'
import useLogout from '../../hooks/AuthScreen/useLogout'

const mockSignOut = jest.fn()

jest.mock('firebase/auth', () => ({
  signOut: (...args) => mockSignOut(...args),
}))

const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()

jest.mock('../../components/Toast/ToastMessage', () => ({
  __esModule: true,
  default: () => ({
    showSuccess: (...args) => mockShowSuccess(...args),
    showError: (...args) => mockShowError(...args),
  }),
}))

jest.mock('../../services/firebase', () => ({
  auth: { mocked: true },
}))

describe('useLogout', () => {
  const navigation = { replace: jest.fn() }
  const alertSpy = jest.spyOn(Alert, 'alert')

  beforeEach(() => {
    jest.clearAllMocks()
    mockSignOut.mockReset()
    mockShowSuccess.mockReset()
    mockShowError.mockReset()
  })

  afterAll(() => {
    alertSpy.mockRestore()
  })

  it('exibe confirmação antes de sair', () => {
    const handleLogout = useLogout(navigation)

    handleLogout()

    expect(Alert.alert).toHaveBeenCalledWith(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancelar' }),
        expect.objectContaining({ text: 'Sair' }),
      ]),
    )
  })

  it('faz logout com sucesso quando o usuário confirma', async () => {
    mockSignOut.mockResolvedValueOnce(undefined)
    const handleLogout = useLogout(navigation)

    handleLogout()
    const actions = Alert.alert.mock.calls[0][2]
    await actions[1].onPress()

    expect(mockSignOut).toHaveBeenCalledWith(expect.objectContaining({ mocked: true }))
    expect(navigation.replace).toHaveBeenCalledWith('Auth')
    expect(mockShowSuccess).toHaveBeenCalledWith('Logout bem-sucedido.')
  })

  it('mostra erro quando o signOut falha', async () => {
    mockSignOut.mockRejectedValueOnce(new Error('nope'))
    const handleLogout = useLogout(navigation)

    handleLogout()
    const actions = Alert.alert.mock.calls[0][2]
    await actions[1].onPress()

    expect(mockShowError).toHaveBeenCalledWith(
      'Não foi possível encerrar a sessão. Tente novamente.',
    )
  })
})
