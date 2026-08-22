import { useEffect, useState } from "react";

import {
  login,
  getSignalements,
  updateSignalement,
  getMe,
} from "./api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./App.css";


function App() {
  const [connecte, setConnecte] = useState(
    localStorage.getItem("access") !== null
  );

  const [signalements, setSignalements] = useState([]);

  const [
    signalementChoisi,
    setSignalementChoisi,
  ] = useState(null);

  const [agent, setAgent] = useState(null);

  const [chargement, setChargement] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  const [recherche, setRecherche] =
    useState("");

  const [
    filtreStatut,
    setFiltreStatut,
  ] = useState("TOUS");

  const [
    accompagnementSeulement,
    setAccompagnementSeulement,
  ] = useState(false);


  // ==========================================
  // CHARGEMENT
  // ==========================================

  useEffect(() => {
    if (!connecte) {
      return;
    }

    chargerSignalements();

    getMe()
      .then((data) => {
        setAgent(data);
      })
      .catch(() => {
        console.log(
          "Impossible de récupérer l'agent."
        );
      });

  }, [connecte]);


  function chargerSignalements() {
    setChargement(true);

    getSignalements()
      .then((data) => {

        setSignalements(data);

        setErreur("");

        setChargement(false);

      })
      .catch(() => {

        setErreur(
          "Impossible de charger les signalements."
        );

        setChargement(false);

      });
  }


  // ==========================================
  // CHANGER LE STATUT
  // ==========================================

  function changerStatut(
    id,
    nouveauStatut
  ) {

    updateSignalement(id, {
      statut: nouveauStatut,
    })

      .then((signalementModifie) => {

        const nouvelleListe =
          signalements.map(
            (signalement) => {

              if (
                signalement.id === id
              ) {
                return signalementModifie;
              }

              return signalement;
            }
          );

        setSignalements(
          nouvelleListe
        );

        setSignalementChoisi(
          signalementModifie
        );

      })

      .catch((erreur) => {

        alert(erreur.message);

      });
  }


  // ==========================================
  // DECONNEXION
  // ==========================================

  function seDeconnecter() {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    setConnecte(false);

    setAgent(null);

    setSignalements([]);

    setSignalementChoisi(null);
  }


  // ==========================================
  // STATISTIQUES PRINCIPALES
  // ==========================================

  const total =
    signalements.length;


  const nouveaux =
    signalements.filter(
      (signalement) =>
        signalement.statut === "NOUVEAU"
    ).length;


  const enAnalyse =
    signalements.filter(
      (signalement) =>
        signalement.statut ===
        "EN_ANALYSE"
    ).length;


  const enApprobation =
    signalements.filter(
      (signalement) =>
        signalement.statut ===
        "EN_APPROBATION"
    ).length;


  const approuves =
    signalements.filter(
      (signalement) =>
        signalement.statut ===
        "APPROUVE"
    ).length;


  const transmis =
    signalements.filter(
      (signalement) =>
        signalement.statut ===
        "TRANSMIS_PARTENAIRE"
    ).length;


  const clotures =
    signalements.filter(
      (signalement) =>
        signalement.statut ===
        "CLOTURE"
    ).length;


  const accompagnements =
    signalements.filter(
      (signalement) =>
        signalement
          .accompagnement_demande === true
    ).length;


  // ==========================================
  // STATISTIQUE GENRE
  // ==========================================

  const femmes =
    signalements.filter(
      (signalement) =>
        signalement.genre
          ?.toLowerCase() === "femme"
    ).length;


  const hommes =
    signalements.filter(
      (signalement) =>
        signalement.genre
          ?.toLowerCase() === "homme"
    ).length;

  console.log(
    "AGES REÇUS :",
    signalements.map(
      (signalement) => signalement.age
    )
  );  
  const donneesGenre = [
    {
      nom: "Femme",
      total: femmes,
    },
    {
      nom: "Homme",
      total: hommes,
    },
  ];


  // ==========================================
  // STATISTIQUE AGE
  // ==========================================

  const donneesAge = [
    {
      nom: "5 - 12 ans",
      total: signalements.filter(
        (signalement) => signalement.age === "5_12"
      ).length,
    },
    {
      nom: "13 - 17 ans",
      total: signalements.filter(
        (signalement) => signalement.age === "13_17"
      ).length,
    },
    {
      nom: "18 - 25 ans",
      total: signalements.filter(
        (signalement) => signalement.age === "18_25"
      ).length,
    },
    {
      nom: "+26 ans",
      total: signalements.filter(
        (signalement) => signalement.age === "PLUS_26"
      ).length,
    },
  ];


  // ==========================================
  // STATISTIQUE PLATEFORMES
  // ==========================================

  // const plateformes = [
  //   "Facebook",
  //   "Instagram",
  //   "WhatsApp",
  //   "Messenger",
  //   "TikTok",
  // ];


  const donneesPlateformes = [
    {
      nom: "Facebook",
      total: signalements.filter(
        (s) => s.plateforme === "FACEBOOK"
      ).length,
    },
    {
      nom: "Instagram",
      total: signalements.filter(
        (s) => s.plateforme === "INSTAGRAM"
      ).length,
    },
    {
      nom: "WhatsApp",
      total: signalements.filter(
        (s) => s.plateforme === "WHATSAPP"
      ).length,
    },
    {
      nom: "Messenger",
      total: signalements.filter(
        (s) => s.plateforme === "MESSENGER"
      ).length,
    },
    {
      nom: "TikTok",
      total: signalements.filter(
        (s) => s.plateforme === "TIKTOK"
      ).length,
    },
  ];


  // ==========================================
  // STATISTIQUE ACCOMPAGNEMENT
  // ==========================================

  const donneesAccompagnement = [
    {
      nom: "Avec accompagnement",

      total: signalements.filter(
        (signalement) =>
          signalement
            .accompagnement_demande ===
          true
      ).length,
    },

    {
      nom: "Sans accompagnement",

      total: signalements.filter(
        (signalement) =>
          signalement
            .accompagnement_demande ===
          false
      ).length,
    },
  ];


  // ==========================================
  // STATISTIQUE CYBERVIOLENCE
  // ==========================================

  const typesCyberviolence = [
    {
      code: "PROPOS_HAINE",
      nom: "Propos de haine",
    },
    {
      code: "PROPOS_RACISTE_DISCRIMINATOIRE",
      nom: "Propos raciste ou discriminatoire",
    },
    {
      code: "DIFFAMATION",
      nom: "Diffamation",
    },
    {
      code: "USURPATION_IDENTITE",
      nom: "Usurpation d'identité",
    },
    {
      code: "PHOTOS_INTIMES",
      nom: "Publication de photos intimes ou personnelles",
    },
    {
      code: "VIDEOS_INTIMES",
      nom: "Publication de vidéos intimes ou personnelles",
    },
    {
      code: "MENACE_PHOTOS_INTIMES",
      nom: "Menace de publier des photos intimes ou personnelles",
    },
    {
      code: "MENACE_VIDEOS_INTIMES",
      nom: "Menace de publier des vidéos intimes ou personnelles",
    },
    {
      code: "AUTRES",
      nom: "Autres",
    },
  ];


  const donneesCyberviolence = typesCyberviolence.map((type) => {
    const total = signalements.filter(
      (signalement) =>
        signalement.cyberharcelement_type === type.code
    ).length;

    return {
      nom: type.nom,
      total: total,
    };
  });


  // ==========================================
  // FILTRES
  // ==========================================

  const signalementsFiltres =
    signalements.filter(
      (signalement) => {

        const texte =
          recherche.toLowerCase();


        const plateforme =
          signalement.plateforme
            ?.toLowerCase() || "";


        const typeCyberviolence =
          signalement
            .cyberharcelement_type
            ?.toLowerCase() || "";


        const typeContenu =
          signalement
            .type_contenu
            ?.toLowerCase() || "";


        const correspondRecherche =
          plateforme.includes(texte) ||
          typeCyberviolence.includes(
            texte
          ) ||
          typeContenu.includes(
            texte
          );


        const correspondStatut =
          filtreStatut === "TOUS" ||
          signalement.statut ===
          filtreStatut;


        const correspondAccompagnement =
          !accompagnementSeulement ||
          signalement
            .accompagnement_demande ===
          true;


        return (
          correspondRecherche &&
          correspondStatut &&
          correspondAccompagnement
        );
      }
    );


  // ==========================================
  // CONNEXION
  // ==========================================

  if (!connecte) {

    return (
      <PageConnexion
        setConnecte={
          setConnecte
        }
      />
    );

  }


  return (
    <div className="site">


      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="topbar">

        <div className="page-container">

          <span>
            EMC HELPLINE
          </span>

          <span>
            Plateforme interne de gestion
          </span>

        </div>

      </div>


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="institution-header">

        <div
          className="
            page-container
            institution-inner
          "
        >

          <div className="brand">

            <div className="brand-logo">
              EMC
            </div>

            <div>

              <h1>
                EMC Helpline
              </h1>

              <p>
                Centre Marocain de Recherches
                Polytechniques et d'Innovation
              </p>

            </div>

          </div>


          {agent && (

            <div className="header-agent">

              <span>
                Agent connecté
              </span>

              <strong>
                {agent.username}
              </strong>

              <small>
                {agent.role}
              </small>

            </div>

          )}

        </div>

      </header>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav className="main-navigation">

        <div
          className="
            page-container
            nav-inner
          "
        >

          <a href="#dashboard">
            Tableau de bord
          </a>

          <a href="#statistiques">
            Statistiques
          </a>

          <a href="#signalements">
            Signalements
          </a>


          <button
            className="logout-button"
            onClick={seDeconnecter}
          >
            Déconnexion
          </button>

        </div>

      </nav>


      {/* =====================================
          CONTENU
      ===================================== */}

      <main>


        {/* HERO */}

        <section className="dashboard-hero">

          <div
            className="
              page-container
              hero-content
            "
          >

            <div>

              <span className="section-label">
                ESPACE AGENTS
              </span>

              <h2>
                Tableau de bord EMC Helpline
              </h2>

              <p>
                Consultez, analysez et suivez
                les signalements reçus depuis
                la plateforme publique.
              </p>

            </div>


            <button
              className="refresh-button"
              onClick={
                chargerSignalements
              }
            >
              Actualiser les données
            </button>

          </div>

        </section>


        <div
          className="
            page-container
            page-content
          "
        >


          {erreur && (

            <div className="error">
              {erreur}
            </div>

          )}


          {chargement && (

            <div className="loading-message">
              Actualisation...
            </div>

          )}


          {/* =================================
              DASHBOARD
          ================================= */}

          <section
            id="dashboard"
            className="dashboard-section"
          >

            <EnteteSection
              petitTitre="VUE D'ENSEMBLE"

              titre={
                "Situation des signalements"
              }

              description={
                "Synthèse actuelle des dossiers enregistrés dans le CRM."
              }
            />


            <div className="cards">

              <Carte
                numero="01"
                titre="Total"
                valeur={total}
              />

              <Carte
                numero="02"
                titre="Nouveaux"
                valeur={nouveaux}
              />

              <Carte
                numero="03"
                titre="En analyse"
                valeur={enAnalyse}
              />

              <Carte
                numero="04"
                titre="En approbation"
                valeur={
                  enApprobation
                }
              />

              <Carte
                numero="05"
                titre="Approuvés"
                valeur={approuves}
              />

              <Carte
                numero="06"
                titre="Transmis"
                valeur={transmis}
              />

              <Carte
                numero="07"
                titre="Accompagnements"
                valeur={
                  accompagnements
                }
              />

              <Carte
                numero="08"
                titre="Clôturés"
                valeur={clotures}
              />

            </div>

          </section>


          {/* =================================
              STATISTIQUES
          ================================= */}

          <section
            id="statistiques"
            className="dashboard-section"
          >

            <EnteteSection
              petitTitre="STATISTIQUES"

              titre={
                "Analyse des signalements"
              }

              description={
                "Répartition des signalements selon le profil, l'âge, les plateformes et le type de cyberviolence."
              }
            />


            <div className="stats-grid">


              {/* =============================
                  GENRE
              ============================= */}

              <div className="stat-card">

                <h3>
                  Répartition par genre
                </h3>


                <ResponsiveContainer
                  width="100%"
                  height={280}
                >

                  <PieChart>

                    <Pie
                      data={donneesGenre}

                      dataKey="total"

                      nameKey="nom"

                      cx="50%"

                      cy="45%"

                      outerRadius={85}

                      label
                    >

                      <Cell
                        fill="#d977aa"
                      />

                      <Cell
                        fill="#2474a6"
                      />

                    </Pie>


                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>


              {/* =============================
                  AGE
              ============================= */}

              <div className="stat-card">

                <h3>
                  Répartition par âge
                </h3>


                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donneesAge}
                      dataKey="total"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={85}
                    >
                      {donneesAge.map((item, index) => (
                        <Cell
                          key={index}
                          fill={[
                            "#1769aa",
                            "#e0ad22",
                            "#43a37a",
                            "#845ec2",
                          ][index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

              </div>


              {/* =============================
                  ACCOMPAGNEMENT
              ============================= */}

              <div className="stat-card">

                <h3>
                  Accompagnement demandé
                </h3>


                <ResponsiveContainer
                  width="100%"
                  height={280}
                >

                  <PieChart>

                    <Pie
                      data={
                        donneesAccompagnement
                      }

                      dataKey="total"

                      nameKey="nom"

                      cx="50%"

                      cy="45%"

                      innerRadius={45}

                      outerRadius={85}
                    >

                      <Cell
                        fill="#0b5c9e"
                      />

                      <Cell
                        fill="#d7a928"
                      />

                    </Pie>


                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>


              {/* =============================
                  PLATEFORMES
              ============================= */}

              <div className="stat-card">

                <h3>
                  Signalements par plateforme
                </h3>


                <ResponsiveContainer
                  width="100%"
                  height={280}
                >

                  <BarChart
                    data={
                      donneesPlateformes
                    }
                  >

                    <XAxis
                      dataKey="nom"
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />


                    <Bar
                      dataKey="total"

                      fill="#0b5c9e"

                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              {/* =============================
                  CYBERVIOLENCE
              ============================= */}

              <div
                className="
                  stat-card
                  stat-card-large
                "
              >

                <h3>
                  Types de cyberviolence signalés
                </h3>


                <ResponsiveContainer
                  width="100%"
                  height={330}
                >

                  <BarChart
                    data={
                      donneesCyberviolence
                    }

                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 80,
                    }}
                  >

                    <XAxis
                      dataKey="nom"

                      interval={0}

                      angle={-25}

                      textAnchor="end"

                      height={110}
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />


                    <Bar
                      dataKey="total"

                      fill="#d7a928"

                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


            </div>

          </section>


          {/* =================================
              SIGNALEMENTS
          ================================= */}

          <section
            id="signalements"
            className="dashboard-section"
          >

            <EnteteSection
              petitTitre="GESTION"

              titre="Signalements"

              description={
                "Recherchez un dossier puis sélectionnez-le pour consulter son détail."
              }
            />


            {/* FILTRES */}

            <div className="filters-panel">


              <div className="filter-search">

                <label>
                  Recherche
                </label>

                <input
                  type="text"

                  placeholder={
                    "Plateforme, cyberviolence, contenu..."
                  }

                  value={recherche}

                  onChange={(event) =>
                    setRecherche(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="filter-select">

                <label>
                  Statut
                </label>


                <select
                  value={filtreStatut}

                  onChange={(event) =>
                    setFiltreStatut(
                      event.target.value
                    )
                  }
                >

                  <option value="TOUS">
                    Tous les statuts
                  </option>

                  <option value="NOUVEAU">
                    Nouveau
                  </option>

                  <option value="EN_ANALYSE">
                    En analyse
                  </option>

                  <option value="EN_APPROBATION">
                    En approbation
                  </option>

                  <option value="APPROUVE">
                    Approuvé
                  </option>

                  <option
                    value="TRANSMIS_PARTENAIRE"
                  >
                    Transmis au partenaire
                  </option>

                  <option value="TRAITE">
                    Traité
                  </option>

                  <option value="REJETE">
                    Rejeté
                  </option>

                  <option value="CLOTURE">
                    Clôturé
                  </option>

                </select>

              </div>


              <button
                className={
                  accompagnementSeulement
                    ? "accompagnement-button active"
                    : "accompagnement-button"
                }

                onClick={() =>
                  setAccompagnementSeulement(
                    !accompagnementSeulement
                  )
                }
              >

                {
                  accompagnementSeulement
                    ? "Afficher tous"
                    : "Avec accompagnement"
                }

              </button>

            </div>


            <div className="results-bar">

              <strong>
                {
                  signalementsFiltres.length
                }
              </strong>

              <span>
                dossier(s) trouvé(s)
              </span>

            </div>


            {/* LISTE + DETAIL */}

            <div className="content">


              <div className="list">


                {
                  signalementsFiltres.length ===
                  0 ? (

                    <div className="empty-state">

                      <h3>
                        Aucun signalement
                      </h3>

                      <p>
                        Aucun dossier ne
                        correspond aux critères.
                      </p>

                    </div>

                  ) : (

                    <table>

                      <thead>

                        <tr>

                          <th>ID</th>

                          <th>
                            Plateforme
                          </th>

                          <th>
                            Type
                          </th>

                          <th>
                            Contenu
                          </th>

                          <th>
                            Accompagnement
                          </th>

                          <th>
                            Statut
                          </th>

                          <th>
                            Date
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          signalementsFiltres.map(
                            (signalement) => (

                              <tr
                                key={
                                  signalement.id
                                }

                                className={
                                  signalementChoisi
                                    ?.id ===
                                  signalement.id
                                    ? "selected-row"
                                    : ""
                                }

                                onClick={() =>
                                  setSignalementChoisi(
                                    signalement
                                  )
                                }
                              >

                                <td>
                                  #
                                  {
                                    signalement.id
                                  }
                                </td>

                                <td>
                                  {
                                    signalement
                                      .plateforme
                                  }
                                </td>

                                <td>
                                  {
                                    signalement
                                      .cyberharcelement_type
                                  }
                                </td>

                                <td>
                                  {
                                    signalement
                                      .type_contenu
                                  }
                                </td>

                                <td>
                                  {
                                    signalement
                                      .accompagnement_demande
                                      ? "Oui"
                                      : "Non"
                                  }
                                </td>

                                <td>

                                  <BadgeStatut
                                    statut={
                                      signalement
                                        .statut
                                    }
                                  />

                                </td>

                                <td>
                                  {
                                    formaterDate(
                                      signalement
                                        .created_at
                                    )
                                  }
                                </td>

                              </tr>

                            )
                          )
                        }

                      </tbody>

                    </table>

                  )
                }

              </div>


              {/* DETAIL */}

              <div className="detail">

                <div className="detail-title">

                  <span>
                    DOSSIER
                  </span>

                  <h2>
                    Détail du signalement
                  </h2>

                </div>


                {!signalementChoisi ? (

                  <div className="empty-detail">

                    <div
                      className="
                        empty-detail-icon
                      "
                    >
                      !
                    </div>

                    <h3>
                      Aucun dossier sélectionné
                    </h3>

                    <p>
                      Cliquez sur un
                      signalement dans la
                      liste.
                    </p>

                  </div>

                ) : (

                  <DetailSignalement

                    signalement={
                      signalementChoisi
                    }

                    changerStatut={
                      changerStatut
                    }

                    role={
                      agent?.role
                    }

                  />

                )}

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer">

        <div
          className="
            page-container
            footer-content
          "
        >

          <div>

            <strong>
              EMC Helpline
            </strong>

            <p>
              Plateforme interne de gestion
              des signalements
            </p>

          </div>

          <span>
            CMRPI
          </span>

        </div>

      </footer>

    </div>
  );
}


// ==========================================
// ENTETE SECTION
// ==========================================

function EnteteSection({
  petitTitre,
  titre,
  description,
}) {

  return (
    <div className="section-header">

      <span>
        {petitTitre}
      </span>

      <h2>
        {titre}
      </h2>

      <p>
        {description}
      </p>

    </div>
  );
}


// ==========================================
// CARTE
// ==========================================

function Carte({
  numero,
  titre,
  valeur,
}) {

  return (
    <div className="card">

      <div className="card-number">
        {numero}
      </div>

      <strong>
        {valeur}
      </strong>

      <span>
        {titre}
      </span>

    </div>
  );
}


// ==========================================
// BADGE
// ==========================================

function BadgeStatut({
  statut,
}) {

  let texte = statut;


  if (statut === "NOUVEAU") {
    texte = "Nouveau";
  }

  if (
    statut === "EN_ANALYSE"
  ) {
    texte = "En analyse";
  }

  if (
    statut === "EN_APPROBATION"
  ) {
    texte = "En approbation";
  }

  if (
    statut === "APPROUVE"
  ) {
    texte = "Approuvé";
  }

  if (
    statut ===
    "TRANSMIS_PARTENAIRE"
  ) {
    texte = "Transmis";
  }

  if (
    statut === "TRAITE"
  ) {
    texte = "Traité";
  }

  if (
    statut === "REJETE"
  ) {
    texte = "Rejeté";
  }

  if (
    statut === "CLOTURE"
  ) {
    texte = "Clôturé";
  }


  return (
    <span
      className={
        `badge ${statut.toLowerCase()}`
      }
    >
      {texte}
    </span>
  );
}


// ==========================================
// DETAIL SIGNALEMENT
// ==========================================

function DetailSignalement({
  signalement,
  changerStatut,
  role,
}) {

  let statutsAutorises = [];


  if (
    role === "AGENT_ANALYSE"
  ) {

    statutsAutorises = [
      "NOUVEAU",
      "EN_ANALYSE",
      "EN_APPROBATION",
    ];

  }


  if (
    role === "AGENT_APPROBATION"
  ) {

    statutsAutorises = [
      "NOUVEAU",
      "EN_ANALYSE",
      "EN_APPROBATION",
      "APPROUVE",
      "REJETE",
    ];

  }


  if (
    role === "ADMIN_EMC"
  ) {

    statutsAutorises = [
      "NOUVEAU",
      "EN_ANALYSE",
      "EN_APPROBATION",
      "APPROUVE",
      "TRANSMIS_PARTENAIRE",
      "TRAITE",
      "REJETE",
      "CLOTURE",
    ];

  }


  return (
    <div className="detail-card">


      <div className="detail-header">

        <div>

          <small>
            IDENTIFIANT
          </small>

          <h3>
            Signalement #
            {signalement.id}
          </h3>

        </div>


        <BadgeStatut
          statut={
            signalement.statut
          }
        />

      </div>


      <div className="detail-info-grid">

        <Information
          titre="Émetteur"
          valeur={
            signalement.emetteur
          }
        />

        <Information
          titre="Genre"
          valeur={
            signalement.genre
          }
        />

        <Information
          titre="Âge"
          valeur={
            signalement.age
          }
        />

        <Information
          titre="Plateforme"
          valeur={
            signalement.plateforme
          }
        />

        <Information
          titre="Cyberviolence"
          valeur={
            signalement
              .cyberharcelement_type
          }
        />

        <Information
          titre="Type de contenu"
          valeur={
            signalement
              .type_contenu
          }
        />

        <Information
          titre="Langue"
          valeur={
            signalement.langue
          }
        />

        <Information
          titre="Création"
          valeur={
            formaterDate(
              signalement.created_at
            )
          }
        />

      </div>


      <Bloc
        titre="Contenu signalé"
      >

        <a
          href={
            signalement.url
          }

          target="_blank"

          rel="noreferrer"
        >
          Ouvrir le contenu signalé →
        </a>

      </Bloc>


      {
        signalement.capture_image_url && (

          <Bloc
            titre="Capture d'écran"
          >

            <img
              src={
                signalement
                  .capture_image_url
              }

              alt={
                "Capture du signalement"
              }

              className={
                "capture-image"
              }
            />

          </Bloc>

        )
      }


      <Bloc
        titre="Accompagnement"
      >

        {
          signalement
            .accompagnement_demande ? (

            <div
              className={
                "detail-info-grid"
              }
            >

              <Information
                titre="Type"

                valeur={
                  signalement
                    .type_accompagnement
                }
              />

              <Information
                titre="Nom"

                valeur={
                  signalement.nom
                }
              />

              <Information
                titre="Prénom"

                valeur={
                  signalement.prenom
                }
              />

              <Information
                titre="Téléphone"

                valeur={
                  signalement
                    .telephone
                }
              />

              <Information
                titre="Ville"

                valeur={
                  signalement
                    .ville_nom ||
                  signalement
                    .ville
                }
              />

            </div>

          ) : (

            <p>
              Pas d’accompagnement
              demandé.
            </p>

          )
        }

      </Bloc>


      <Bloc titre="Historique">

        {
          signalement.historique &&
          signalement.historique
            .length > 0 ? (

            <div className="timeline">

              {
                signalement
                  .historique
                  .map(
                    (action) => (

                      <div
                        className={
                          "historique-item"
                        }

                        key={
                          action.id
                        }
                      >

                        <div
                          className={
                            "timeline-dot"
                          }
                        />


                        <strong>
                          {
                            action
                              .agent_nom ||
                            "Agent non identifié"
                          }
                        </strong>


                        <p>
                          {
                            action
                              .ancien_statut
                          }

                          {" → "}

                          {
                            action
                              .nouveau_statut
                          }
                        </p>


                        <small>
                          {
                            formaterDate(
                              action
                                .date_action
                            )
                          }
                        </small>

                      </div>

                    )
                  )
              }

            </div>

          ) : (

            <p>
              Aucun historique.
            </p>

          )
        }

      </Bloc>


      <Bloc
        titre="Changer le statut"
      >

        <div className="actions">

          {
            tousLesStatuts

              .filter(
                (statut) =>
                  statutsAutorises
                    .includes(
                      statut.valeur
                    )
              )

              .map(
                (statut) => (

                  <button
                    key={
                      statut.valeur
                    }

                    className={
                      signalement.statut ===
                      statut.valeur
                        ? "status-button current"
                        : "status-button"
                    }

                    onClick={() =>
                      changerStatut(
                        signalement.id,
                        statut.valeur
                      )
                    }
                  >

                    {
                      statut.texte
                    }

                  </button>

                )
              )
          }

        </div>

      </Bloc>

    </div>
  );
}


// ==========================================
// BLOC
// ==========================================

function Bloc({
  titre,
  children,
}) {

  return (
    <div className="detail-block">

      <h4>
        {titre}
      </h4>

      <div>
        {children}
      </div>

    </div>
  );
}


// ==========================================
// INFORMATION
// ==========================================

function Information({
  titre,
  valeur,
}) {

  return (
    <div className="info">

      <span>
        {titre}
      </span>

      <strong>
        {valeur || "Non précisé"}
      </strong>

    </div>
  );
}


// ==========================================
// DATE
// ==========================================

function formaterDate(date) {

  if (!date) {
    return "Non précisée";
  }

  return new Date(
    date
  ).toLocaleString(
    "fr-FR"
  );
}


// ==========================================
// PAGE CONNEXION
// ==========================================

function PageConnexion({
  setConnecte,
}) {

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    erreur,
    setErreur,
  ] = useState("");


  function seConnecter(event) {

    event.preventDefault();

    setErreur("");


    login(
      username,
      password
    )

      .then((data) => {

        localStorage.setItem(
          "access",
          data.access
        );

        localStorage.setItem(
          "refresh",
          data.refresh
        );

        setConnecte(true);

      })

      .catch(() => {

        setErreur(
          "Nom d'utilisateur ou mot de passe incorrect."
        );

      });

  }


  return (
    <div className="login-page">


      <div className="login-top">
        EMC HELPLINE
      </div>


      <div className="login-content">


        <div
          className={
            "login-presentation"
          }
        >

          <div
            className={
              "brand-logo big"
            }
          >
            EMC
          </div>


          <span>
            ESPACE INTERNE
          </span>


          <h1>
            Gestion des signalements
          </h1>


          <p>
            Plateforme interne destinée
            aux agents EMC Helpline.
          </p>

        </div>


        <form
          className="login-box"

          onSubmit={
            seConnecter
          }
        >

          <span
            className={
              "login-label"
            }
          >
            AUTHENTIFICATION
          </span>


          <h2>
            Connexion
          </h2>


          <p>
            Accédez à votre espace agent.
          </p>


          <label>
            Nom d'utilisateur
          </label>


          <input
            type="text"

            value={username}

            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }

            required
          />


          <label>
            Mot de passe
          </label>


          <input
            type="password"

            value={password}

            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }

            required
          />


          {erreur && (

            <div className="error">
              {erreur}
            </div>

          )}


          <button type="submit">
            Se connecter
          </button>

        </form>

      </div>

    </div>
  );
}


// ==========================================
// STATUTS
// ==========================================

const tousLesStatuts = [

  {
    valeur: "NOUVEAU",
    texte: "Nouveau",
  },

  {
    valeur: "EN_ANALYSE",
    texte: "En analyse",
  },

  {
    valeur: "EN_APPROBATION",
    texte: "En approbation",
  },

  {
    valeur: "APPROUVE",
    texte: "Approuvé",
  },

  {
    valeur:
      "TRANSMIS_PARTENAIRE",

    texte:
      "Transmis partenaire",
  },

  {
    valeur: "TRAITE",
    texte: "Traité",
  },

  {
    valeur: "REJETE",
    texte: "Rejeté",
  },

  {
    valeur: "CLOTURE",
    texte: "Clôturé",
  },

];


export default App;