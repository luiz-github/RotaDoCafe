const createResult = (isValid, error = null) => ({ isValid, error })

const normalize = (value) => value?.toString().trim() || ''

const validateTitle = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Título é obrigatório')
  if (v.length < 3) return createResult(false, 'Título muito curto')
  return createResult(true)
}

const validateCity = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Cidade é obrigatória')
  return createResult(true)
}

const validateState = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Estado é obrigatório')
  return createResult(true)
}

const validateLocation = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Local é obrigatório')
  return createResult(true)
}

const validateDescription = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Descrição é obrigatória')
  if (v.length < 5) return createResult(false, 'Descrição muito curta')
  return createResult(true)
}

const validateOrganizer = (value) => {
  const v = normalize(value)
  if (!v) return createResult(false, 'Organizador é obrigatório')
  return createResult(true)
}

const validatePrice = (value) => {
  const v = normalize(value)

  if (!v) {
    return createResult(false, 'Preço é obrigatório. Se for gratuito, informe 0.00')
  }

  // Aceita entrada com vírgula ou ponto
  const normalized = v.replace(',', '.')

  const num = Number(normalized)
  if (!Number.isFinite(num)) {
    return createResult(false, 'Preço inválido')
  }

  if (num < 0) {
    return createResult(false, 'Preço inválido')
  }

  return createResult(true)
}

const validateEventForm = (data) => {
  const validators = {
    title: () => validateTitle(data.title),
    city: () => validateCity(data.city),
    state: () => validateState(data.state),
    location: () => validateLocation(data.location),
    description: () => validateDescription(data.description),
    organizer: () => validateOrganizer(data.organizer),
    price: () => validatePrice(data.price),
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

export { validateEventForm }
