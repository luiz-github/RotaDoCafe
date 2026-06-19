import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

import SuggestedRouteCard from '../../components/Card/SuggestedRouteCard'
import { suggestedRoutes } from '../../data/suggestedRoutes'

describe('SuggestedRouteCard', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('renderiza a primeira rota', () => {
    const { getByText } = render(<SuggestedRouteCard onPress={jest.fn()} />)

    expect(getByText(`${suggestedRoutes[0].icon} ${suggestedRoutes[0].title}`)).toBeTruthy()
  })

  it('chama onPress ao clicar no card', () => {
    const onPress = jest.fn()

    const { getByText } = render(<SuggestedRouteCard onPress={onPress} />)

    fireEvent.press(getByText(`${suggestedRoutes[0].icon} ${suggestedRoutes[0].title}`))

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledWith(suggestedRoutes[0])
  })

  it('troca para a próxima rota após 15 segundos', () => {
    const { getByText } = render(<SuggestedRouteCard onPress={jest.fn()} />)

    act(() => {
      jest.advanceTimersByTime(15000)
    })

    expect(getByText(`${suggestedRoutes[1].icon} ${suggestedRoutes[1].title}`)).toBeTruthy()
  })

  it('continua rotacionando as rotas automaticamente', () => {
    const { getByText } = render(<SuggestedRouteCard onPress={jest.fn()} />)

    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(getByText(`${suggestedRoutes[2].icon} ${suggestedRoutes[2].title}`)).toBeTruthy()
  })

  it('retorna para a primeira rota após completar o ciclo', () => {
    const { getByText } = render(<SuggestedRouteCard onPress={jest.fn()} />)

    act(() => {
      jest.advanceTimersByTime(suggestedRoutes.length * 15000)
    })

    expect(getByText(`${suggestedRoutes[0].icon} ${suggestedRoutes[0].title}`)).toBeTruthy()
  })
})
