/**
 * Validações para o registro de usuário
 * Cada função retorna { isValid: boolean, error?: string }
 */

const validateUsername = (username) => {
  const normalizedUsername = username?.trim() || ''

  if (!normalizedUsername) {
    return { isValid: false, error: 'Usuário é obrigatório' }
  }

  if (normalizedUsername.length < 3) {
    return { isValid: false, error: 'Usuário deve ter pelo menos 3 caracteres' }
  }

  if (normalizedUsername.length > 20) {
    return { isValid: false, error: 'Usuário não pode ter mais de 20 caracteres' }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername)) {
    return {
      isValid: false,
      error: 'Usuário pode conter apenas letras, números, _ e -',
    }
  }

  return { isValid: true }
}

const validateEmail = (email) => {
  const normalizedEmail = email?.trim() || ''

  if (!normalizedEmail) {
    return { isValid: false, error: 'E-mail é obrigatório' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalizedEmail)) {
    return { isValid: false, error: 'E-mail inválido' }
  }

  return { isValid: true }
}

const validatePassword = (password) => {
  const normalizedPassword = password?.trim() || ''

  if (!normalizedPassword) {
    return { isValid: false, error: 'Senha é obrigatória' }
  }

  if (normalizedPassword.length < 6) {
    return { isValid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
  }

  if (normalizedPassword.length > 50) {
    return { isValid: false, error: 'Senha não pode ter mais de 50 caracteres' }
  }

  // Verifica se tem pelo menos uma letra e um número
  if (!/[a-zA-Z]/.test(normalizedPassword) || !/[0-9]/.test(normalizedPassword)) {
    return {
      isValid: false,
      error: 'Senha deve conter letras e números',
    }
  }

  return { isValid: true }
}

const validateConfirmPassword = (password, confirmPassword) => {
  const normalizedPassword = password?.trim() || ''
  const normalizedConfirmPassword = confirmPassword?.trim() || ''

  if (!normalizedConfirmPassword) {
    return { isValid: false, error: 'Confirmação de senha é obrigatória' }
  }

  if (normalizedPassword !== normalizedConfirmPassword) {
    return { isValid: false, error: 'As senhas não coincidem' }
  }

  return { isValid: true }
}

/**
 * Valida todos os campos do registro
 * @returns { isValid: boolean, errors: { [field]: string } }
 */
const validateRegisterForm = ({ username, email, password, confirmPassword }) => {
  const errors = {}

  const usernameValidation = validateUsername(username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error
  }

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Verifica se o formulário pode ser enviado
 * (todos os campos preenchidos, sem erros)
 */
const canSubmitForm = ({ username, email, password, confirmPassword }) => {
  // Verifica se todos os campos estão preenchidos
  if (!username?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    return false
  }

  // Valida o formulário
  const validation = validateRegisterForm({ username, email, password, confirmPassword })
  return validation.isValid
}

export {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
  canSubmitForm,
}
