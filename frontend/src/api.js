const API_BASE_URL = "http://localhost:8000/api";

export async function getSignalements() {
  const response = await fetch(`${API_BASE_URL}/signalements/`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des signalements");
  }

  return response.json();
}

export async function updateSignalement(id, data) {
  const response = await fetch(`${API_BASE_URL}/signalements/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour du signalement");
  }

  return response.json();
}