export const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return { date: "", time: "" };
  }

  try {
    const date = timestamp.toDate();

    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { date: "", time: "" };
  }
};