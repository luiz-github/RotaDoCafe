const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const createResult = (isValid, error = null) => ({ isValid, error })

const validateEmail = (email) => {
  const value = email?.trim() || ''
  if (!value) return createResult(false, 'E-mail é obrigatório')
  if (!EMAIL_REGEX.test(value)) return createResult(false, 'E-mail inválido')
  return createResult(true)
}

const validatePassword = (password) => {
  const value = password?.trim() || ''
  if (!value) return createResult(false, 'Senha é obrigatória')
  if (value.length < 6) return createResult(false, 'Senha deve ter pelo menos 6 caracteres')
  return createResult(true)
}

const validateLoginForm = ({ email, password }) => {
  const errors = {}

  const emailResult = validateEmail(email)
  if (!emailResult.isValid) errors.email = emailResult.error

  const passwordResult = validatePassword(password)
  if (!passwordResult.isValid) errors.password = passwordResult.error

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const canSubmitLoginForm = (data) => {
  if (!data?.email || !data?.password) return false
  return validateLoginForm(data).isValid
}

const canSubmitEmailOnlyForm = (email) => {
  if (!email) return false
  return validateEmail(email).isValid
}

export {
  validateEmail,
  validatePassword,
  validateLoginForm,
  canSubmitLoginForm,
  canSubmitEmailOnlyForm,
}
