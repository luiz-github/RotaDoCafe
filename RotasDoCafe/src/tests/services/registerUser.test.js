const mockCreateUserWithEmailAndPassword = jest.fn()
const mockDeleteUser = jest.fn()
const mockSetDoc = jest.fn()
const mockDoc = jest.fn()
const mockServerTimestamp = jest.fn(() => 'server-timestamp')

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
  deleteUser: (...args) => mockDeleteUser(...args),
}))

jest.mock('firebase/firestore', () => ({
  doc: (...args) => mockDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
  setDoc: (...args) => mockSetDoc(...args),
}))

jest.mock('../../services/firebase', () => ({
  auth: { mocked: true },
  db: { mocked: true },
  COLLECTIONS: { USERS: 'users' },
}))

const { registerUserInFirebase } = require('../../services/auth/registerUser')

describe('registerUserInFirebase', () => {
  beforeEach(() => {
    mockCreateUserWithEmailAndPassword.mockReset()
    mockDeleteUser.mockReset()
    mockSetDoc.mockReset()
    mockDoc.mockReset()
    mockServerTimestamp.mockClear()
  })

  it('salva o perfil do usuário ao registrar com sucesso', async () => {
    const user = { uid: 'user-1' }
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user })
    mockSetDoc.mockResolvedValueOnce(undefined)
    mockDoc.mockReturnValueOnce({ mockedDocRef: true })

    await expect(
      registerUserInFirebase({ username: 'rota', email: 'TESTE@EXEMPLO.COM ', password: 'abc123' }),
    ).resolves.toEqual({ user })

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({ mocked: true }),
      'TESTE@EXEMPLO.COM ',
      'abc123',
    )
    expect(mockSetDoc).toHaveBeenCalledWith(
      { mockedDocRef: true },
      expect.objectContaining({
        uid: 'user-1',
        username: 'rota',
        email: 'teste@exemplo.com',
        role: 'user',
        deletedAt: null,
        firstLogin: true,
        photoURL: null,
      }),
    )
  })

  it('faz rollback do usuário Auth quando o Firestore falha', async () => {
    const user = { uid: 'user-2' }
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user })
    mockSetDoc.mockRejectedValueOnce(new Error('firestore failed'))
    mockDeleteUser.mockResolvedValueOnce(undefined)
    mockDoc.mockReturnValueOnce({ mockedDocRef: true })

    await expect(
      registerUserInFirebase({ username: 'rota', email: 'teste@exemplo.com', password: 'abc123' }),
    ).rejects.toThrow('firestore failed')

    expect(mockDeleteUser).toHaveBeenCalledWith(user)
  })
})
