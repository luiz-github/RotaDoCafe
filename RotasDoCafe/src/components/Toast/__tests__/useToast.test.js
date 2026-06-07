// Suíte do wrapper de toast: valida os três tipos de mensagem padronizados do app.
const mockToastShow = jest.fn()

jest.mock('react-native-toast-message', () => ({
  show: (...args) => mockToastShow(...args),
}))

const useToast = require('../ToastMessage').default

describe('useToast', () => {
  beforeEach(() => {
    mockToastShow.mockReset()
  })

  it('dispara toast de sucesso, erro e aviso com a estrutura correta', () => {
    const { showSuccess, showError, showInfo } = useToast()

    showSuccess('Tudo certo')
    showError('Algo falhou')
    showInfo('Atenção')

    expect(mockToastShow).toHaveBeenNthCalledWith(1, {
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tudo certo',
    })
    expect(mockToastShow).toHaveBeenNthCalledWith(2, {
      type: 'error',
      text1: 'Erro',
      text2: 'Algo falhou',
    })
    expect(mockToastShow).toHaveBeenNthCalledWith(3, {
      type: 'info',
      text1: 'Aviso',
      text2: 'Atenção',
    })
  })
})
