const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";
  
export function login(username, password) {
  return fetch(`${API_URL}/login/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Identifiants incorrects.");
    }

    return response.json();
  });
}

// Demander un nouveau access token
function refreshToken() {
  const refresh = localStorage.getItem("refresh");

  return fetch(`${API_URL}/token/refresh/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      refresh: refresh,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Session expirée.");
      }

      return response.json();
    })
    .then((data) => {
      localStorage.setItem(
        "access",
        data.access
      );

      return data.access;
    });
}

// Charger les signalements
export function getSignalements() {
  const token = localStorage.getItem("access");

  return fetch(`${API_URL}/signalements/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {

    // Si access token expiré
    if (response.status === 401) {

      return refreshToken().then((nouveauToken) => {

        // Refaire la requête avec le nouveau token
        return fetch(`${API_URL}/signalements/`, {
          headers: {
            Authorization: `Bearer ${nouveauToken}`,
          },
        });

      });
    }

    return response;

  }).then((response) => {

    if (!response.ok) {
      throw new Error(
        "Impossible de charger les signalements."
      );
    }

    return response.json();
  });
}

// Modifier un signalement
/*export function updateSignalement(id, data) {
  const token = localStorage.getItem("access");

  return fetch(
    `${API_URL}/signalements/${id}/`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  )
    .then((response) => {

      if (response.status === 401) {

        return refreshToken().then((nouveauToken) => {

          return fetch(
            `${API_URL}/signalements/${id}/`,
            {
              method: "PATCH",

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${nouveauToken}`,
              },

              body: JSON.stringify(data),
            }
          );

        });
      }

      return response;
    })

    .then((response) => {

      if (!response.ok) {
        throw new Error(
          "Impossible de modifier le signalement."
        );
      }

      return response.json();
    });
}*/
export function updateSignalement(id, data) {
  const token = localStorage.getItem("access");

  return fetch(
    `${API_URL}/signalements/${id}/`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  ).then(async (response) => {

    if (!response.ok) {
      const erreur = await response.json();

      throw new Error(
        erreur.detail ||
        "Impossible de modifier le statut."
      );
    }

    return response.json();
  });
}

export function getMe() {
  const token = localStorage.getItem("access");

  return fetch(`${API_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        "Impossible de récupérer l'utilisateur."
      );
    }

    return response.json();
  });
}