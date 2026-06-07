import React from 'react'
import { render } from '@testing-library/react-native'
import AppLogo from '../AppLogo'

describe('AppLogo', () => {
  it('renderiza título e subtítulo informados', () => {
    const { getByText } = render(<AppLogo title="Rota do Café" subtitle="O melhor café" />)

    expect(getByText('Rota do Café')).toBeTruthy()
    expect(getByText('O melhor café')).toBeTruthy()
  })

  it('mantém a renderização em modo horizontal', () => {
    const { getByText } = render(<AppLogo horizontal title="Rota do Café" />)

    expect(getByText('Rota do Café')).toBeTruthy()
  })
})
