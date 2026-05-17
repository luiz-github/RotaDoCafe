const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

const createResult = (isValid, error = null) => ({ isValid, error })

const normalize = (value) => value?.trim() || ''

const validateUsername = (username) => {
  const value = normalize(username)
  if (!value) return createResult(false, 'Usuário é obrigatório')
  if (value.length < 3) return createResult(false, 'Usuário deve ter pelo menos 3 caracteres')
  if (value.length > 20) return createResult(false, 'Usuário não pode ter mais de 20 caracteres')
  if (!USERNAME_REGEX.test(value)) {
    return createResult(false, 'Usuário pode conter apenas letras, números, _ e -')
  }
  return createResult(true)
}

const validateEmail = (email) => {
  const value = normalize(email)
  if (!value) return createResult(false, 'E-mail é obrigatório')
  if (!EMAIL_REGEX.test(value)) return createResult(false, 'E-mail inválido')
  return createResult(true)
}

const validatePassword = (password) => {
  const value = normalize(password)
  if (!value) return createResult(false, 'Senha é obrigatória')
  if (value.length < 6) return createResult(false, 'Senha deve ter pelo menos 6 caracteres')
  if (value.length > 50) return createResult(false, 'Senha não pode ter mais de 50 caracteres')
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return createResult(false, 'Senha deve conter letras e números')
  }
  return createResult(true)
}

const validateConfirmPassword = (password, confirmPassword) => {
  const pass = normalize(password)
  const confirm = normalize(confirmPassword)
  if (!confirm) return createResult(false, 'Confirmação de senha é obrigatória')
  if (pass !== confirm) return createResult(false, 'As senhas não coincidem')
  return createResult(true)
}

const validateRegisterForm = (data) => {
  const validators = {
    username: () => validateUsername(data.username),
    email: () => validateEmail(data.email),
    password: () => validatePassword(data.password),
    confirmPassword: () => validateConfirmPassword(data.password, data.confirmPassword),
  }

  const errors = Object.entries(validators).reduce((acc, [field, fn]) => {
    const result = fn()
    if (!result.isValid) acc[field] = result.error
    return acc
  }, {})

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const canSubmitForm = (data) => {
  const requiredFields = ['username', 'email', 'password', 'confirmPassword']
  const hasEmpty = requiredFields.some((field) => !normalize(data?.[field]))
  if (hasEmpty) return false
  return validateRegisterForm(data).isValid
}

export {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
  canSubmitForm,
}
