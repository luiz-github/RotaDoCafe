const FIREBASE_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/account-exists-with-different-credential': 'Já existe uma conta com outro método de login.',
  'auth/operation-not-allowed': 'Operação não permitida.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  'auth/internal-error': 'Ocorreu um erro inesperado. Tente novamente.',
  PERMISSION_DENIED: 'Você não tem permissão para realizar esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  ALREADY_EXISTS: 'Este registro já existe.',
  UNAVAILABLE: 'Serviço temporariamente indisponível.',
  UNAUTHENTICATED: 'Você precisa estar logado.',
}

const DEFAULT_ERROR_MESSAGE = 'Erro inesperado. Tente novamente.'

const getFirebaseErrorMessage = (errorCode) => {
  if (!errorCode) return DEFAULT_ERROR_MESSAGE
  return FIREBASE_ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR_MESSAGE
}

const CONTEXT_ERROR_OVERRIDES = {
  login: {
    'auth/user-not-found': 'E-mail ou senha inválidos.',
    'auth/wrong-password': 'E-mail ou senha inválidos.',
  },
}

const applyContextRules = (errorCode, context) => {
  return CONTEXT_ERROR_OVERRIDES[context]?.[errorCode]
}

const handleFirebaseError = (error, context = 'default') => {
  const errorCode = error?.code
  let message = getFirebaseErrorMessage(errorCode)
  const contextualMessage = applyContextRules(errorCode, context)
  if (contextualMessage) message = contextualMessage
  if (!errorCode) console.warn('Erro sem código:', error)
  return {
    success: false,
    message,
    code: errorCode,
    error,
  }
}

const handleSuccessResponse = (data = {}, message = 'Operação concluída com sucesso') => {
  return {
    success: true,
    message,
    data,
  }
}

export { getFirebaseErrorMessage, handleFirebaseError, handleSuccessResponse }
