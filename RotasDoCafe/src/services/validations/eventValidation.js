export const validateEventForm = (form) => {
  const errors = {};

  if (!form.title || form.title.trim() === "") {
    errors.title = "Título é obrigatório";
  } else if (form.title.trim().length < 3) {
    errors.title = "Título deve ter no mínimo 3 caracteres";
  } else if (form.title.trim().length > 100) {
    errors.title = "Título deve ter no máximo 100 caracteres";
  }

  if (!form.location || form.location.trim() === "") {
    errors.location = "Local do evento é obrigatório";
  } else if (form.location.trim().length < 3) {
    errors.location = "Informe um local válido";
  }

  if (!form.latitude || !form.longitude) {
    errors.coordinates = "Você precisa definir a localização no mapa";
  } else if (
    form.latitude === -22.4038900 &&
    form.longitude === -43.6625000 &&
    !form.location?.trim()
  ) {
    errors.coordinates = "Busque um local no mapa antes de salvar";
  }

  if (!form.description || form.description.trim() === "") {
    errors.description = "Descrição é obrigatória";
  } else if (form.description.trim().length < 10) {
    errors.description = "Descrição deve ter no mínimo 10 caracteres";
  } else if (form.description.trim().length > 1000) {
    errors.description = "Descrição deve ter no máximo 1000 caracteres";
  }

  if (!form.organizer || form.organizer.trim() === "") {
    errors.organizer = "Organizador é obrigatório";
  } else if (form.organizer.trim().length < 2) {
    errors.organizer = "Informe um organizador válido";
  }

  if (form.price === undefined || form.price === null || form.price === "") {
    errors.price = "Preço é obrigatório (use 0 para gratuito)";
  } else {
    const priceNumber = Number(String(form.price).replace(",", "."));
    if (isNaN(priceNumber)) {
      errors.price = "Preço inválido";
    } else if (priceNumber < 0) {
      errors.price = "Preço não pode ser negativo";
    } else if (priceNumber > 999999) {
      errors.price = "Preço excede o limite máximo";
    }
  }

  if (!form.eventDateTime) {
    errors.eventDateTime = "Data e hora são obrigatórias";
  }

  if (!form.age_rating || form.age_rating.trim() === "") {
    errors.age_rating = "Classificação etária é obrigatória";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateFutureEventDateTime = (eventDateTime) => {
  if (!eventDateTime) {
    return {
      isValid: false,
      error: "Data e hora são obrigatórias",
    };
  }

  const now = new Date();
  const eventDate = new Date(eventDateTime);

  if (eventDate <= now) {
    return {
      isValid: false,
      error: "O evento deve ser em uma data futura",
    };
  }

  return { isValid: true };
};

export const validateLocation = (form, locationConfirmed) => {
  if (!locationConfirmed) {
    return {
      isValid: false,
      error:
        "Você precisa validar o local usando Buscar Local, Minha Localização ou Selecionar no Mapa",
    };
  }

  if (!form.latitude || !form.longitude) {
    return {
      isValid: false,
      error: "Você precisa definir a localização no mapa",
    };
  }

  if (!form.location || form.location.trim() === "") {
    return {
      isValid: false,
      error: "Busque o local no mapa antes de salvar",
    };
  }

  return { isValid: true };
};