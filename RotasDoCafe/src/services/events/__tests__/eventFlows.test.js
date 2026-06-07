const mockAddDoc = jest.fn()
const mockCollection = jest.fn((...args) => ({ type: 'collection', args }))
const mockDoc = jest.fn((...args) => ({ type: 'doc', args }))
const mockGetDocs = jest.fn()
const mockServerTimestamp = jest.fn(() => 'server-timestamp')
const mockUpdateDoc = jest.fn()

const mockAuth = {
  currentUser: null,
}

jest.mock('firebase/firestore', () => ({
  addDoc: (...args) => mockAddDoc(...args),
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  serverTimestamp: () => mockServerTimestamp(),
  updateDoc: (...args) => mockUpdateDoc(...args),
}))

jest.mock('../../firebase', () => ({
  auth: mockAuth,
  COLLECTIONS: { EVENTS: 'events' },
  db: { mocked: true },
}))

const { fetchEvents, createEvent, updateEvent, removeEvent } = require('../eventRepository')
const eventService = require('../eventService')

describe('event flows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAddDoc.mockReset()
    mockGetDocs.mockReset()
    mockUpdateDoc.mockReset()
    mockAuth.currentUser = null
  })

  it('filtra eventos apagados e ordena por data de criação', async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'event-2',
          data: () => ({ title: 'B', deletedAt: null, createdAt: { toMillis: () => 200 } }),
        },
        {
          id: 'event-1',
          data: () => ({ title: 'A', deletedAt: null, createdAt: { toMillis: () => 100 } }),
        },
        {
          id: 'event-3',
          data: () => ({ title: 'C', deletedAt: 'deleted', createdAt: { toMillis: () => 50 } }),
        },
      ],
    })

    await expect(fetchEvents()).resolves.toEqual([
      { id: 'event-1', title: 'A', deletedAt: null, createdAt: { toMillis: expect.any(Function) } },
      { id: 'event-2', title: 'B', deletedAt: null, createdAt: { toMillis: expect.any(Function) } },
    ])
  })

  it('impede criação sem usuário autenticado', async () => {
    await expect(createEvent({ title: 'Evento' })).rejects.toThrow('Usuário não autenticado')
  })

  it('cria evento com metadados do usuário atual', async () => {
    mockAuth.currentUser = { uid: 'user-1' }
    mockAddDoc.mockResolvedValueOnce({ id: 'new-event' })

    await expect(createEvent({ title: 'Evento' })).resolves.toEqual({ id: 'new-event' })
    expect(mockAddDoc).toHaveBeenCalledWith(
      { type: 'collection', args: [expect.objectContaining({ mocked: true }), 'events'] },
      expect.objectContaining({
        title: 'Evento',
        createdBy: 'user-1',
        deletedAt: null,
      }),
    )
  })

  it('atualiza e remove eventos pelo repositório', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined)

    await expect(updateEvent('event-1', { title: 'Novo título' })).resolves.toBeUndefined()
    await expect(removeEvent('event-1')).resolves.toBeUndefined()

    expect(mockUpdateDoc).toHaveBeenNthCalledWith(
      1,
      { type: 'doc', args: [expect.objectContaining({ mocked: true }), 'events', 'event-1'] },
      expect.objectContaining({ title: 'Novo título', updatedAt: 'server-timestamp' }),
    )
    expect(mockUpdateDoc).toHaveBeenNthCalledWith(
      2,
      { type: 'doc', args: [expect.objectContaining({ mocked: true }), 'events', 'event-1'] },
      expect.objectContaining({ deletedAt: 'server-timestamp' }),
    )
  })

  it('repete as operações do serviço de eventos', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'service-event' })
    mockUpdateDoc.mockResolvedValueOnce(undefined)
    mockAuth.currentUser = { uid: 'user-1' }

    await expect(eventService.createEvent({ title: 'Evento' })).resolves.toEqual({
      id: 'service-event',
    })
    await expect(eventService.deleteEvent('event-2')).resolves.toBeUndefined()
    await expect(eventService.updateEvent('event-3', { title: 'Outro' })).resolves.toBeUndefined()
  })
})
