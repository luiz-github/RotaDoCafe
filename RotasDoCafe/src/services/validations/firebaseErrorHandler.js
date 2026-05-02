/**
 * Gerenciador de erros do Firebase
 * Traduz erros do Firebase para mensagens amigáveis ao usuário
 */

/**
 * Traduz códigos de erro do Firebase em mensagens legíveis
 */
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // 🔐 Autenticação
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/account-exists-with-different-credential':
      'Já existe uma conta com outro método de login.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/internal-error': 'Ocorreu um erro inesperado. Tente novamente.',

    // 🔒 Firestore / permissões
    PERMISSION_DENIED: 'Você não tem permissão para realizar esta ação.',
    NOT_FOUND: 'Recurso não encontrado.',
    ALREADY_EXISTS: 'Este registro já existe.',
    UNAVAILABLE: 'Serviço temporariamente indisponível.',
    UNAUTHENTICATED: 'Você precisa estar logado.',
  }

  return errorMessages[errorCode] || 'Erro inesperado. Tente novamente.'
}

/**
 * Processa erros do Firebase e retorna mensagem formatada
 */
const handleFirebaseError = (error, context = 'default') => {
  let message = getFirebaseErrorMessage(error.code)

  if (context === 'login' && error.code === 'auth/user-not-found') {
    message = 'E-mail ou senha inválidos.'
  }

  return {
    success: false,
    message,
    error,
  }
}
/**
 * Retorno de sucesso padronizado
 */
const handleSuccessResponse = (data = {}) => {
  return {
    success: true,
    message: 'Operação concluída com sucesso',
    data,
  }
}

export { getFirebaseErrorMessage, handleFirebaseError, handleSuccessResponse }
