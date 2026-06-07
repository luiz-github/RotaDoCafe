import React from 'react'
import { ActivityIndicator } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'
import Button from '../Button'

describe('Button', () => {
  it('renderiza o título e dispara o callback', () => {
    const onPress = jest.fn()

    const { getByText } = render(<Button title="Salvar" onPress={onPress} />)

    fireEvent.press(getByText('Salvar'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('desabilita o botão quando está carregando e mostra o indicador', () => {
    const onPress = jest.fn()

    const { getByText, UNSAFE_getByType } = render(
      <Button title="Entrar" loading onPress={onPress} variant="danger" />,
    )

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy()

    fireEvent.press(getByText('Entrar'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('aceita a variante secundária sem quebrar a renderização', () => {
    const { getByText } = render(
      <Button title="Continuar" variant="secondary" onPress={jest.fn()} />,
    )

    expect(getByText('Continuar')).toBeTruthy()
  })
})
