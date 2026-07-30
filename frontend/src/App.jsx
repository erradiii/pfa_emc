import { useEffect, useState } from "react";
import { getSignalements, updateSignalement } from "./api";
import "./App.css";

function App() {
  const [signalements, setSignalements] = useState([]);
  const [signalementChoisi, setSignalementChoisi] = useState(null);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Valeurs des filtres
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("TOUS");
  const [accompagnementSeulement, setAccompagnementSeulement] =
    useState(false);

  // Charger les signalements au démarrage
  useEffect(() => {
    chargerSignalements();
  }, []);

  // Récupérer les signalements depuis l’API
  function chargerSignalements() {
    setChargement(true);

    getSignalements()
      .then((data) => {
        setSignalements(data);
        setErreur("");
        setChargement(false);
      })
      .catch(() => {
        setErreur("Impossible de charger les signalements.");
        setChargement(false);
      });
  }

  // Modifier le statut d’un signalement
  function changerStatut(id, nouveauStatut) {
    updateSignalement(id, {
      statut: nouveauStatut,
    })
      .then((signalementModifie) => {
        const nouvelleListe = signalements.map((signalement) => {
          if (signalement.id === id) {
            return signalementModifie;
          }

          return signalement;
        });

        setSignalements(nouvelleListe);
        setSignalementChoisi(signalementModifie);
      })
      .catch(() => {
        alert("Impossible de modifier le statut.");
      });
  }

  // Statistiques du dashboard
  const total = signalements.length;

  const nouveaux = signalements.filter(
    (signalement) => signalement.statut === "NOUVEAU"
  ).length;

  const enCours = signalements.filter(
    (signalement) => signalement.statut === "EN_COURS"
  ).length;

  const resolus = signalements.filter(
    (signalement) => signalement.statut === "RESOLU"
  ).length;

  const accompagnements = signalements.filter(
    (signalement) => signalement.accompagnement_demande === true
  ).length;

  // Liste affichée après application des filtres
  const signalementsFiltres = signalements.filter((signalement) => {
    const texteRecherche = recherche.toLowerCase();

    const plateforme =
      signalement.plateforme?.toLowerCase() || "";

    const typeCyberviolence =
      signalement.cyberharcelement_type?.toLowerCase() || "";

    const typeContenu =
      signalement.type_contenu?.toLowerCase() || "";

    const correspondRecherche =
      plateforme.includes(texteRecherche) ||
      typeCyberviolence.includes(texteRecherche) ||
      typeContenu.includes(texteRecherche);

    const correspondStatut =
      filtreStatut === "TOUS" ||
      signalement.statut === filtreStatut;

    const correspondAccompagnement =
      accompagnementSeulement === false ||
      signalement.accompagnement_demande === true;

    return (
      correspondRecherche &&
      correspondStatut &&
      correspondAccompagnement
    );
  });

  if (chargement) {
    return (
      <p className="page">
        Chargement des signalements...
      </p>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>EMC CRM</h2>
        <p>Interface agents</p>

        <nav>
          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#signalements">
            Signalements
          </a>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>
              Tableau de bord EMC Helpline
            </h1>

            <p>
              Suivi interne des signalements reçus depuis
              le formulaire public.
            </p>
          </div>

          <button onClick={chargerSignalements}>
            Actualiser
          </button>
        </header>

        {erreur && (
          <p className="error">
            {erreur}
          </p>
        )}

        <section
          id="dashboard"
          className="cards"
        >
          <Carte
            titre="Total signalements"
            valeur={total}
          />

          <Carte
            titre="Nouveaux"
            valeur={nouveaux}
          />

          <Carte
            titre="En cours"
            valeur={enCours}
          />

          <Carte
            titre="Résolus"
            valeur={resolus}
          />

          <Carte
            titre="Accompagnements"
            valeur={accompagnements}
          />
        </section>

        <section
          id="signalements"
          className="content"
        >
          <div className="list">
            <h2 >
              Liste des signalements
            </h2>

            <div className="filters">
              <input
                type="text"
                placeholder="Rechercher par plateforme ou type..."
                value={recherche}
                onChange={(event) =>
                  setRecherche(event.target.value)
                }
              />

              <select
                value={filtreStatut}
                onChange={(event) =>
                  setFiltreStatut(event.target.value)
                }
              >
                <option value="TOUS">
                  Tous les statuts
                </option>

                <option value="NOUVEAU">
                  Nouveau
                </option>

                <option value="EN_COURS">
                  En cours
                </option>

                <option value="RESOLU">
                  Résolu
                </option>
              </select>

              <button
                className={
                  accompagnementSeulement
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setAccompagnementSeulement(
                    !accompagnementSeulement
                  )
                }
              >
                {accompagnementSeulement
                  ? "Afficher tous"
                  : "Accompagnement seulement"}
              </button>
            </div>

            <p className="result-count">
              {signalementsFiltres.length} résultat(s)
            </p>

            {signalementsFiltres.length === 0 ? (
              <p>
                Aucun signalement trouvé.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Plateforme</th>
                    <th>Type</th>
                    <th>Contenu</th>
                    <th>Accompagnement</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {signalementsFiltres.map(
                    (signalement) => (
                      <tr
                        key={signalement.id}
                        onClick={() =>
                          setSignalementChoisi(
                            signalement
                          )
                        }
                      >
                        <td>
                          #{signalement.id}
                        </td>

                        <td>
                          {signalement.plateforme}
                        </td>

                        <td>
                          {
                            signalement.cyberharcelement_type
                          }
                        </td>

                        <td>
                          {signalement.type_contenu}
                        </td>

                        <td>
                          {signalement.accompagnement_demande
                            ? "Oui"
                            : "Non"}
                        </td>

                        <td>
                          <BadgeStatut
                            statut={
                              signalement.statut
                            }
                          />
                        </td>

                        <td>
                          {formaterDate(
                            signalement.created_at
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="detail">
            <h2>
              Détail du signalement
            </h2>

            {!signalementChoisi ? (
              <p>
                Sélectionne un signalement dans la liste.
              </p>
            ) : (
              <DetailSignalement
                signalement={signalementChoisi}
                changerStatut={changerStatut}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Carte({ titre, valeur }) {
  return (
    <div className="card">
      <span>{titre}</span>
      <strong>{valeur}</strong>
    </div>
  );
}

function BadgeStatut({ statut }) {
  let texte = statut;

  if (statut === "NOUVEAU") {
    texte = "Nouveau";
  }

  if (statut === "EN_COURS") {
    texte = "En cours";
  }

  if (statut === "RESOLU") {
    texte = "Résolu";
  }

  return (
    <span
      className={`badge ${statut.toLowerCase()}`}
    >
      {texte}
    </span>
  );
}

function DetailSignalement({
  signalement,
  changerStatut,
}) {
  return (
    <div className="detail-card">
      <div className="detail-header">
        <h3>
          Signalement #{signalement.id}
        </h3>

        <BadgeStatut
          statut={signalement.statut}
        />
      </div>

      <Information
        titre="Émetteur"
        valeur={signalement.emetteur}
      />

      <Information
        titre="Genre"
        valeur={signalement.genre}
      />

      <Information
        titre="Âge"
        valeur={signalement.age}
      />

      <Information
        titre="Plateforme"
        valeur={signalement.plateforme}
      />

      <Information
        titre="Type de cyberviolence"
        valeur={
          signalement.cyberharcelement_type
        }
      />

      <Information
        titre="Type de contenu"
        valeur={signalement.type_contenu}
      />

      <Information
        titre="Langue"
        valeur={signalement.langue}
      />

      <Information
        titre="Date de création"
        valeur={formaterDate(
          signalement.created_at
        )}
      />

      <div className="block">
        <h4>Lien du contenu</h4>

        <a
          href={signalement.url}
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir le contenu signalé
        </a>
      </div>

      <div className="block">
        <h4>Accompagnement</h4>

        {signalement.accompagnement_demande ? (
          <>
            <Information
              titre="Type"
              valeur={
                signalement.type_accompagnement
              }
            />

            <Information
              titre="Nom"
              valeur={signalement.nom}
            />

            <Information
              titre="Prénom"
              valeur={signalement.prenom}
            />

            <Information
              titre="Téléphone"
              valeur={signalement.telephone}
            />

            <Information
              titre="Ville"
              valeur={
                signalement.ville_nom ||
                signalement.ville
              }
            />
          </>
        ) : (
          <p>
            Pas d’accompagnement demandé.
          </p>
        )}
      </div>

      <div className="block">
        <h4>Changer le statut</h4>

        <div className="actions">
          <button
            onClick={() =>
              changerStatut(
                signalement.id,
                "NOUVEAU"
              )
            }
          >
            Nouveau
          </button>

          <button
            onClick={() =>
              changerStatut(
                signalement.id,
                "EN_COURS"
              )
            }
          >
            En cours
          </button>

          <button
            onClick={() =>
              changerStatut(
                signalement.id,
                "RESOLU"
              )
            }
          >
            Résolu
          </button>
        </div>
      </div>
    </div>
  );
}

function Information({ titre, valeur }) {
  return (
    <div className="info">
      <span>{titre}</span>

      <strong>
        {valeur || "Non précisé"}
      </strong>
    </div>
  );
}

function formaterDate(date) {
  if (!date) {
    return "Non précisée";
  }

  return new Date(date).toLocaleString(
    "fr-FR"
  );
}

export default App;