import { getRoutePath } from '../../services/routesService'

global.fetch = jest.fn()

describe('getRoutePath', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retorna array vazio quando possui menos de 2 locais', async () => {
    const result = await getRoutePath([])

    expect(result).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('chama a API corretamente', async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            geometry: {
              coordinates: [
                [-43.6983, -22.243],
                [-43.7065, -22.2463],
              ],
            },
          },
        ],
      }),
    })

    await getRoutePath([
      {
        latitude: -22.243,
        longitude: -43.6983,
      },
      {
        latitude: -22.2463,
        longitude: -43.7065,
      },
    ])

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('converte as coordenadas para latitude e longitude', async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            geometry: {
              coordinates: [
                [-43.6983, -22.243],
                [-43.7065, -22.2463],
              ],
            },
          },
        ],
      }),
    })

    const result = await getRoutePath([
      {
        latitude: -22.243,
        longitude: -43.6983,
      },
      {
        latitude: -22.2463,
        longitude: -43.7065,
      },
    ])

    expect(result).toEqual([
      {
        latitude: -22.243,
        longitude: -43.6983,
      },
      {
        latitude: -22.2463,
        longitude: -43.7065,
      },
    ])
  })

  it('lança erro quando a API retorna falha', async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        code: 'InvalidQuery',
        routes: [],
      }),
    })

    await expect(
      getRoutePath([
        {
          latitude: -22.243,
          longitude: -43.6983,
        },
        {
          latitude: -22.2463,
          longitude: -43.7065,
        },
      ]),
    ).rejects.toThrow('Erro ao gerar rota')
  })
})
