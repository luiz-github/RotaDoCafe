import {
  canSubmitEmailOnlyForm,
  canSubmitLoginForm,
  validateEmail as validateLoginEmail,
  validateLoginForm,
  validatePassword as validateLoginPassword,
} from '../../services/validations/loginValidation'
import {
  canSubmitForm,
  validateConfirmPassword,
  validateEmail as validateRegisterEmail,
  validatePassword as validateRegisterPassword,
  validateRegisterForm,
  validateUsername,
} from '../../services/validations/registerValidation'
import { validateEventForm } from '../../services/validations/eventValidation'
import { getFieldError, isFieldComplete } from '../../services/validations/fieldValidation'
import {
  getFirebaseErrorMessage,
  handleFirebaseError,
  handleSuccessResponse,
} from '../../services/validations/firebaseErrorHandler'

describe('validation flows', () => {
  it('valida login com e-mail e senha', () => {
    expect(validateLoginEmail(' usuario@exemplo.com ')).toEqual({ isValid: true, error: null })
    expect(validateLoginEmail('')).toEqual({ isValid: false, error: 'E-mail é obrigatório' })
    expect(validateLoginEmail('invalido')).toEqual({ isValid: false, error: 'E-mail inválido' })

    expect(validateLoginPassword(' 12345 ')).toEqual({
      isValid: false,
      error: 'Senha deve ter pelo menos 6 caracteres',
    })
    expect(validateLoginPassword('123456')).toEqual({ isValid: true, error: null })

    expect(validateLoginForm({ email: 'email@teste.com', password: '123456' })).toEqual({
      isValid: true,
      errors: {},
    })
    expect(validateLoginForm({ email: '', password: '' })).toEqual({
      isValid: false,
      errors: {
        email: 'E-mail é obrigatório',
        password: 'Senha é obrigatória',
      },
    })
    expect(canSubmitLoginForm({ email: 'email@teste.com', password: '123456' })).toBe(true)
    expect(canSubmitLoginForm({ email: 'email@teste.com', password: '12345' })).toBe(false)
    expect(canSubmitEmailOnlyForm('email@teste.com')).toBe(true)
    expect(canSubmitEmailOnlyForm('')).toBe(false)
  })

  it('valida cadastro com limites e confirmação', () => {
    expect(validateUsername(' ab ')).toEqual({
      isValid: false,
      error: 'Usuário deve ter pelo menos 3 caracteres',
    })
    expect(validateUsername('usuario_invalido!')).toEqual({
      isValid: false,
      error: 'Usuário pode conter apenas letras, números, _ e -',
    })
    expect(validateUsername('usuario-teste')).toEqual({ isValid: true, error: null })

    expect(validateRegisterEmail('')).toEqual({ isValid: false, error: 'E-mail é obrigatório' })
    expect(validateRegisterEmail('valido@teste.com')).toEqual({ isValid: true, error: null })

    expect(validateRegisterPassword('12345')).toEqual({
      isValid: false,
      error: 'Senha deve ter pelo menos 6 caracteres',
    })
    expect(validateRegisterPassword('abcdef')).toEqual({
      isValid: false,
      error: 'Senha deve conter letras e números',
    })
    expect(validateRegisterPassword('abc123')).toEqual({ isValid: true, error: null })

    expect(validateConfirmPassword('abc123', '')).toEqual({
      isValid: false,
      error: 'Confirmação de senha é obrigatória',
    })
    expect(validateConfirmPassword('abc123', 'abc124')).toEqual({
      isValid: false,
      error: 'As senhas não coincidem',
    })
    expect(validateConfirmPassword('abc123', 'abc123')).toEqual({ isValid: true, error: null })

    expect(
      validateRegisterForm({
        username: 'usuario-teste',
        email: 'a@b.com',
        password: 'abc123',
        confirmPassword: 'abc123',
      }),
    ).toEqual({ isValid: true, errors: {} })
    expect(
      validateRegisterForm({ username: '', email: '', password: '', confirmPassword: '' }),
    ).toEqual({
      isValid: false,
      errors: {
        username: 'Usuário é obrigatório',
        email: 'E-mail é obrigatório',
        password: 'Senha é obrigatória',
        confirmPassword: 'Confirmação de senha é obrigatória',
      },
    })
    expect(
      canSubmitForm({
        username: 'usuario',
        email: 'a@b.com',
        password: 'abc123',
        confirmPassword: 'abc123',
      }),
    ).toBe(true)
    expect(
      canSubmitForm({
        username: 'usuario',
        email: 'a@b.com',
        password: 'abc123',
        confirmPassword: '',
      }),
    ).toBe(false)
  })

  it('valida eventos e campos individuais', () => {
    expect(validateEventForm({})).toEqual({
      isValid: false,
      errors: {
        title: 'Título é obrigatório',
        location: 'Local do evento é obrigatório',
        coordinates: 'Você precisa definir a localização no mapa',
        description: 'Descrição é obrigatória',
        organizer: 'Organizador é obrigatório',
        price: 'Preço é obrigatório (use 0 para gratuito)',
        eventDateTime: 'Data e hora são obrigatórias',
        age_rating: 'Classificação etária é obrigatória',
      },
    })
    expect(
      validateEventForm({
        title: 'Café ao Amanhecer',
        location: 'Centro',
        latitude: -22.9,
        longitude: -43.2,
        description: 'Evento delicioso para amantes de café',
        organizer: 'Rota do Café',
        price: '10,50',
        eventDateTime: new Date('2030-01-01'),
        age_rating: 'Livre',
      }),
    ).toEqual({
      isValid: true,
      errors: {},
    })
    expect(
      validateEventForm({
        title: 'Te',
        location: 'Lo',
        description: 'abc',
        organizer: 'O',
        price: '-1',
        eventDateTime: null,
        age_rating: '',
      }),
    ).toMatchObject({
      isValid: false,
      errors: {
        title: 'Título deve ter no mínimo 3 caracteres',
        location: 'Informe um local válido',
        coordinates: 'Você precisa definir a localização no mapa',
        description: 'Descrição deve ter no mínimo 10 caracteres',
        organizer: 'Informe um organizador válido',
        price: 'Preço não pode ser negativo',
        eventDateTime: 'Data e hora são obrigatórias',
        age_rating: 'Classificação etária é obrigatória',
      },
    })

    expect(getFieldError('username', 'ab')).toEqual({
      hasError: true,
      message: 'Mín. 3 caracteres',
    })
    expect(getFieldError('email', 'email@teste.com')).toEqual({ hasError: false })
    expect(getFieldError('confirmPassword', 'abc123', 'abc124')).toEqual({
      hasError: true,
      message: 'Senhas não coincidem',
    })
    expect(getFieldError('unknown', 'qualquer')).toEqual({ hasError: false })
    expect(isFieldComplete('password', 'abc123')).toBe(true)
    expect(isFieldComplete('password', '123')).toBe(false)
    expect(isFieldComplete('email', '   ')).toBe(false)
  })

  it('mapeia erros do Firebase', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    expect(getFirebaseErrorMessage('auth/user-not-found')).toBe('Usuário não encontrado.')
    expect(getFirebaseErrorMessage('unknown-code')).toBe('Erro inesperado. Tente novamente.')
    expect(handleFirebaseError({ code: 'auth/wrong-password' }, 'login')).toEqual({
      success: false,
      message: 'E-mail ou senha inválidos.',
      code: 'auth/wrong-password',
      error: { code: 'auth/wrong-password' },
    })
    expect(handleFirebaseError({ message: 'Falhou sem código' })).toEqual({
      success: false,
      message: 'Erro inesperado. Tente novamente.',
      code: undefined,
      error: { message: 'Falhou sem código' },
    })
    expect(handleSuccessResponse({ id: '1' })).toEqual({
      success: true,
      message: 'Operação concluída com sucesso',
      data: { id: '1' },
    })

    warnSpy.mockRestore()
  })
})
