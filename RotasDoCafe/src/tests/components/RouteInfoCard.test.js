import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import RouteInfoCard from '../../components/Card/RouteInfoCard'

describe('RouteInfoCard', () => {
  const routeMock = {
    icon: '🏛️',
    title: 'Centro Histórico',
    places: [{ name: 'Museu Ferroviário' }, { name: 'Casa Léa Pentagna' }, { name: 'Cruzeiro' }],
  }

  it('não renderiza quando route é nulo', () => {
    const { queryByText } = render(
      <RouteInfoCard route={null} selectedIndex={0} onSelect={jest.fn()} />,
    )

    expect(queryByText('Centro Histórico')).toBeNull()
  })

  it('renderiza o título da rota', () => {
    const { getByText } = render(
      <RouteInfoCard route={routeMock} selectedIndex={0} onSelect={jest.fn()} />,
    )

    expect(getByText('🏛️ Centro Histórico')).toBeTruthy()
  })

  it('renderiza todos os locais da rota', () => {
    const { getByText } = render(
      <RouteInfoCard route={routeMock} selectedIndex={0} onSelect={jest.fn()} />,
    )

    expect(getByText(/Museu Ferroviário/)).toBeTruthy()

    expect(getByText(/Casa Léa Pentagna/)).toBeTruthy()

    expect(getByText(/Cruzeiro/)).toBeTruthy()
  })

  it('chama onSelect ao pressionar um item', () => {
    const onSelect = jest.fn()

    const { getByText } = render(
      <RouteInfoCard route={routeMock} selectedIndex={0} onSelect={onSelect} />,
    )

    fireEvent.press(getByText(/Casa Léa Pentagna/))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('marca o item selecionado com indicador verde', () => {
    const { getByText } = render(
      <RouteInfoCard route={routeMock} selectedIndex={1} onSelect={jest.fn()} />,
    )

    expect(getByText('🟢 2. Casa Léa Pentagna')).toBeTruthy()
  })
})
