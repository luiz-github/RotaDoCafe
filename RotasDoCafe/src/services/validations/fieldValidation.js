const validators = {
  username: (value) => {
    if (!value) return { hasError: false }
    if (value.length < 3) return { hasError: true, message: 'Mín. 3 caracteres' }
    if (value.length > 20) return { hasError: true, message: 'Máx. 20 caracteres' }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { hasError: true, message: 'Apenas letras, números, _ e -' }
    }
    return { hasError: false }
  },

  email: (value) => {
    if (!value) return { hasError: false }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { hasError: true, message: 'E-mail inválido' }
    }
    return { hasError: false }
  },

  password: (value) => {
    if (!value) return { hasError: false }
    if (value.length < 6) return { hasError: true, message: 'Mín. 6 caracteres' }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return { hasError: true, message: 'Precisa de letras e números' }
    }
    return { hasError: false }
  },

  confirmPassword: (value, otherPassword) => {
    if (!value) return { hasError: false }
    if (value !== otherPassword) {
      return { hasError: true, message: 'Senhas não coincidem' }
    }
    return { hasError: false }
  },
}

const getFieldError = (fieldName, value, otherPassword = '') => {
  const validator = validators[fieldName]
  if (!validator) return { hasError: false }
  return validator(value, otherPassword)
}

const isFieldComplete = (fieldName, value, otherPassword = '') => {
  if (!value || value.trim() === '') return false
  return !getFieldError(fieldName, value, otherPassword).hasError
}

export { getFieldError, isFieldComplete }
