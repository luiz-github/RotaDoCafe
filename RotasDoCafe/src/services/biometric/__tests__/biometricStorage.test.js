// Suíte de storage biométrico: cobre normalização, persistência, limpeza e comparação de credenciais.
const mockSecureStore = {
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}

jest.mock('expo-secure-store', () => mockSecureStore)

const secretKeyForTest = (email) =>
  `${process.env.EXPO_PUBLIC_BIOMETRIC_SECRET_PREFIX}${email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9._-]/g, '_')}`

const {
  normalizeEmail,
  saveBiometricEmail,
  getBiometricEmail,
  clearBiometricEmail,
  isBiometricEmailMatch,
  saveBiometricSecret,
  getBiometricSecret,
  clearBiometricSecret,
} = require('../biometricStorage')

describe('biometric storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSecureStore.setItemAsync.mockReset()
    mockSecureStore.getItemAsync.mockReset()
    mockSecureStore.deleteItemAsync.mockReset()
  })

  it('normaliza e-mail antes de salvar e comparar', async () => {
    expect(normalizeEmail(' Usuario@Exemplo.com ')).toBe('usuario@exemplo.com')

    await saveBiometricEmail(' Usuario@Exemplo.com ')
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY,
      'usuario@exemplo.com',
    )

    mockSecureStore.getItemAsync.mockResolvedValueOnce('usuario@exemplo.com')
    await expect(getBiometricEmail()).resolves.toBe('usuario@exemplo.com')

    mockSecureStore.getItemAsync.mockResolvedValueOnce('usuario@exemplo.com')
    await expect(isBiometricEmailMatch(' USUARIO@EXEMPLO.COM ')).resolves.toBe(true)
    await expect(isBiometricEmailMatch('')).resolves.toBe(false)
  })

  it('remove o e-mail salvo quando a entrada fica vazia', async () => {
    await saveBiometricEmail('')
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY,
    )

    await clearBiometricEmail()
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY,
    )
  })

  it('salva, lê e apaga segredos por usuário', async () => {
    await saveBiometricSecret('user+test@example.com', 'senha-secreta')
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      secretKeyForTest('user+test@example.com'),
      'senha-secreta',
    )

    mockSecureStore.getItemAsync.mockResolvedValueOnce('senha-secreta')
    await expect(getBiometricSecret('user+test@example.com')).resolves.toBe('senha-secreta')

    await clearBiometricSecret('user+test@example.com')
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      secretKeyForTest('user+test@example.com'),
    )

    await saveBiometricSecret('user+test@example.com', '')
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      secretKeyForTest('user+test@example.com'),
    )
  })
})
