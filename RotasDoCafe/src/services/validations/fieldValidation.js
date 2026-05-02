/**
 * Gerenciador de mensagens de validação
 * Funções para mostrar feedbacks ao usuário
 */

/**
 * Valida um campo específico e retorna se há erro
 * @param {string} fieldName - Nome do campo (username, email, password, confirmPassword)
 * @param {string} value - Valor do campo
 * @param {string} otherPassword - Valor da outra senha (para confirmPassword)
 * @returns { hasError: boolean, message?: string }
 */
const getFieldError = (fieldName, value, otherPassword = '') => {
  if (fieldName === 'username') {
    if (!value) {
      return { hasError: false } // Campo vazio não é erro até tentar submeter
    }
    if (value.length < 3) {
      return { hasError: true, message: 'Mín. 3 caracteres' }
    }
    if (value.length > 20) {
      return { hasError: true, message: 'Máx. 20 caracteres' }
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { hasError: true, message: 'Apenas letras, números, _ e -' }
    }
    return { hasError: false }
  } else if (fieldName === 'email') {
    if (!value) {
      return { hasError: false }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { hasError: true, message: 'E-mail inválido' }
    }
    return { hasError: false }
  } else if (fieldName === 'password') {
    if (!value) {
      return { hasError: false }
    }
    if (value.length < 6) {
      return { hasError: true, message: 'Mín. 6 caracteres' }
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return { hasError: true, message: 'Precisa de letras e números' }
    }
    return { hasError: false }
  } else if (fieldName === 'confirmPassword') {
    if (!value) {
      return { hasError: false }
    }
    if (value !== otherPassword) {
      return { hasError: true, message: 'Senhas não coincidem' }
    }
    return { hasError: false }
  } else {
    return { hasError: false }
  }
}

/**
 * Retorna se um campo está completo e válido
 */
const isFieldComplete = (fieldName, value, otherPassword = '') => {
  if (!value || value.trim() === '') {
    return false
  }

  const error = getFieldError(fieldName, value, otherPassword)
  return !error.hasError
}

export { getFieldError, isFieldComplete }
