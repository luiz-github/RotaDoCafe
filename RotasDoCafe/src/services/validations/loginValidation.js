const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'E-mail é obrigatório' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'E-mail inválido' }
  }

  return { isValid: true }
}

const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Senha é obrigatória' }
  }

  if (password.trim().length < 6) {
    return { isValid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
  }

  return { isValid: true }
}

const validateLoginForm = ({ email, password }) => {
  const errors = {}

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const canSubmitLoginForm = ({ email, password }) => {
  if (!email || !password) {
    return false
  }

  const validation = validateLoginForm({ email, password })
  return validation.isValid
}

const canSubmitEmailOnlyForm = (email) => {
  if (!email) {
    return false
  }

  return validateEmail(email).isValid
}

export {
  validateEmail,
  validatePassword,
  validateLoginForm,
  canSubmitLoginForm,
  canSubmitEmailOnlyForm,
}
