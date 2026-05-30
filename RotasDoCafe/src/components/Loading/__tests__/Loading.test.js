// Suíte do overlay de carregamento: cobre ausência de render quando invisível e texto quando visível.
import React from 'react'
import { render } from '@testing-library/react-native'
import Loading from '../Loading'

describe('Loading', () => {
  it('não renderiza nada quando está invisível', () => {
    const { toJSON } = render(<Loading visible={false} />)

    expect(toJSON()).toBeNull()
  })

  it('renderiza o texto informado quando visível', () => {
    const { getByText } = render(<Loading visible text="Buscando dados" />)

    expect(getByText('Buscando dados')).toBeTruthy()
  })
})
