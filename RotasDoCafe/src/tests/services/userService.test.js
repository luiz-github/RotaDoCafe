const mockUpdateEmail = jest.fn()
const mockCollection = jest.fn((...args) => ({ type: 'collection', args }))
const mockDoc = jest.fn((...args) => ({ type: 'doc', args }))
const mockGetDoc = jest.fn()
const mockGetDocs = jest.fn()
const mockLimit = jest.fn((value) => ({ type: 'limit', value }))
const mockQuery = jest.fn((...args) => ({ type: 'query', args }))
const mockUpdateDoc = jest.fn()
const mockWhere = jest.fn((...args) => ({ type: 'where', args }))

const mockAuth = {
  currentUser: null,
}

jest.mock('firebase/auth', () => ({
  updateEmail: (...args) => mockUpdateEmail(...args),
}))

jest.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  limit: (...args) => mockLimit(...args),
  query: (...args) => mockQuery(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  where: (...args) => mockWhere(...args),
}))

jest.mock('../../services/firebase', () => ({
  auth: mockAuth,
  COLLECTIONS: { USERS: 'users' },
  db: { mocked: true },
}))

const {
  getCurrentUserProfile,
  getCurrentUserRole,
  getUserByEmail,
  markUserFirstLoginAsCompleted,
  updateCurrentProfilePhoto,
  updateCurrentUserProfile,
} = require('../../services/users/userService')

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateEmail.mockReset()
    mockGetDoc.mockReset()
    mockGetDocs.mockReset()
    mockUpdateDoc.mockReset()
    mockAuth.currentUser = null
  })

  it('retorna null quando não há usuário autenticado', async () => {
    await expect(getCurrentUserProfile()).resolves.toBeNull()
    await expect(getCurrentUserRole()).resolves.toBeNull()
  })

  it('mapeia o perfil atual quando o documento existe', async () => {
    mockAuth.currentUser = { uid: 'user-1', email: 'fallback@exemplo.com' }
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        username: 'Rota',
        email: 'rota@exemplo.com',
        role: 'admin',
        firstLogin: false,
        biometricEnabled: true,
        photoURL: 'photo-url',
      }),
    })

    await expect(getCurrentUserProfile()).resolves.toEqual({
      uid: 'user-1',
      name: 'Rota',
      email: 'rota@exemplo.com',
      role: 'admin',
      firstLogin: false,
      biometricEnabled: true,
      photoURL: 'photo-url',
    })
  })

  it('usa valores padrão quando o perfil não existe no Firestore', async () => {
    mockAuth.currentUser = { uid: 'user-2', email: 'fallback@exemplo.com' }
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
      data: () => null,
    })

    await expect(getCurrentUserProfile()).resolves.toEqual({
      uid: 'user-2',
      name: '',
      email: 'fallback@exemplo.com',
      role: 'user',
      firstLogin: false,
      biometricEnabled: false,
      photoURL: null,
    })
  })

  it('busca usuário por e-mail normalizado e retorna o primeiro match', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'user-3',
          data: () => ({ username: 'Rota', email: 'rota@exemplo.com' }),
        },
      ],
    })

    await expect(getUserByEmail('  ROTA@EXEMPLO.COM ')).resolves.toEqual({
      id: 'user-3',
      username: 'Rota',
      email: 'rota@exemplo.com',
    })
    expect(mockCollection).toHaveBeenCalledWith(expect.objectContaining({ mocked: true }), 'users')
  })

  it('atualiza o perfil e tenta sincronizar o e-mail do Auth', async () => {
    mockAuth.currentUser = { uid: 'user-4', email: 'antigo@exemplo.com' }
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'Atualizado', email: 'novo@exemplo.com' }),
    })
    mockUpdateEmail.mockResolvedValueOnce(undefined)
    mockUpdateDoc.mockResolvedValueOnce(undefined)

    await expect(
      updateCurrentUserProfile({ name: 'Novo Nome', email: 'novo@exemplo.com' }),
    ).resolves.toEqual({
      profile: {
        uid: 'user-4',
        name: 'Atualizado',
        email: 'novo@exemplo.com',
        role: 'user',
        firstLogin: false,
        biometricEnabled: false,
        photoURL: null,
      },
      authEmailUpdated: true,
    })

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { type: 'doc', args: [expect.objectContaining({ mocked: true }), 'users', 'user-4'] },
      { username: 'Novo Nome' },
    )
    expect(mockUpdateEmail).toHaveBeenCalledWith(mockAuth.currentUser, 'novo@exemplo.com')
  })

  it('continua quando a atualização do e-mail do Auth falha', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    mockAuth.currentUser = { uid: 'user-5', email: 'antigo@exemplo.com' }
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'Atualizado' }),
    })
    mockUpdateEmail.mockRejectedValueOnce(new Error('auth failed'))
    mockUpdateDoc.mockResolvedValueOnce(undefined)

    await expect(
      updateCurrentUserProfile({ name: 'Novo Nome', email: 'novo@exemplo.com' }),
    ).resolves.toMatchObject({
      authEmailUpdated: false,
    })

    warnSpy.mockRestore()
  })

  it('marca o primeiro login como concluído e normaliza o e-mail', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined)

    await expect(markUserFirstLoginAsCompleted('user-6', ' USER@EXEMPLO.COM ')).resolves.toBe(true)
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { type: 'doc', args: [expect.objectContaining({ mocked: true }), 'users', 'user-6'] },
      {
        firstLogin: false,
        email: 'user@exemplo.com',
      },
    )
    await expect(markUserFirstLoginAsCompleted(null, 'user@exemplo.com')).resolves.toBe(false)
  })

  it('atualiza a foto de perfil do usuário autenticado', async () => {
    mockAuth.currentUser = { uid: 'user-7' }
    mockUpdateDoc.mockResolvedValueOnce(undefined)

    await expect(updateCurrentProfilePhoto('base64-image')).resolves.toBeUndefined()
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { type: 'doc', args: [expect.objectContaining({ mocked: true }), 'users', 'user-7'] },
      { photoURL: 'base64-image' },
    )
  })

  it('lança erro ao atualizar a foto de perfil quando o Firestore falha', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAuth.currentUser = { uid: 'user-8' }
    mockUpdateDoc.mockRejectedValueOnce(new Error('photo failed'))

    await expect(updateCurrentProfilePhoto('base64-image')).rejects.toThrow('photo failed')
    errorSpy.mockRestore()
  })
})
