const mockSendPasswordResetEmail = jest.fn()

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: (...args) => mockSendPasswordResetEmail(...args),
}))

jest.mock('../../services/firebase', () => ({
  auth: { mocked: true },
}))

const { sendResetEmail } = require('../../services/auth/forgotPassword')

describe('sendResetEmail', () => {
  beforeEach(() => {
    mockSendPasswordResetEmail.mockReset()
  })

  it('rejeita e-mail inválido antes de chamar o Firebase', async () => {
    await expect(sendResetEmail('')).rejects.toThrow('E-mail inválido')
    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('envia a recuperação com e-mail normalizado', async () => {
    mockSendPasswordResetEmail.mockResolvedValueOnce(undefined)

    await expect(sendResetEmail(' Usuario@Exemplo.com ')).resolves.toEqual({ success: true })
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.objectContaining({ mocked: true }),
      'Usuario@Exemplo.com',
    )
  })

  it('converte falha do Firebase em retorno amigável', async () => {
    mockSendPasswordResetEmail.mockRejectedValueOnce({ message: 'Falha no Firebase' })

    await expect(sendResetEmail('usuario@exemplo.com')).resolves.toEqual({
      success: false,
      message: 'Falha no Firebase',
    })
  })
})
