from django.db import models
from django.core.exceptions import ValidationError


class Region(models.Model):
    nom = models.CharField(max_length=255, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Région"
        verbose_name_plural = "Régions"
        ordering = ["nom"]

    def __str__(self):
        return self.nom


class Ville(models.Model):
    nom = models.CharField(max_length=255)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="villes"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ville"
        verbose_name_plural = "Villes"
        ordering = ["nom"]

    def __str__(self):
        return self.nom


class Signalement(models.Model):
    class Emetteur(models.TextChoices):
        POUR_MOI = "POUR_MOI", "Signaler pour vous"
        POUR_QUELQUUN = "POUR_QUELQUUN", "Signaler pour quelqu'un"

    class Genre(models.TextChoices):
        FEMME = "FEMME", "Femme"
        HOMME = "HOMME", "Homme"
        

    class Statut(models.TextChoices):
        NOUVEAU = "NOUVEAU", "Nouveau"

        EN_ANALYSE = "EN_ANALYSE", "En analyse"

        EN_APPROBATION = (
        "EN_APPROBATION",
        "En approbation",
        )

        APPROUVE = "APPROUVE", "Approuvé"

        TRANSMIS_PARTENAIRE = (
        "TRANSMIS_PARTENAIRE",
        "Transmis au partenaire",
        )

        TRAITE = "TRAITE", "Traité"

        REJETE = "REJETE", "Rejeté"

        CLOTURE = "CLOTURE", "Clôturé"

    class TypeAccompagnement(models.TextChoices):
        JURIDIQUE = "JURIDIQUE", "Juridique"
        PSYCHIQUE = "PSYCHIQUE", "Psychique"

    class Age(models.TextChoices):
        AGE_5_12 = "5_12", "Âges de 5 à 12 ans"
        AGE_13_17 = "13_17", "Âges de 13 à 17 ans"
        AGE_18_25 = "18_25", "Âges de 18 à 25 ans"
        PLUS_26 = "PLUS_26", "Plus de 26 ans"


    class TypeCyberviolence(models.TextChoices):
        PROPOS_HAINE = "PROPOS_HAINE", "Propos de haine"

        PROPOS_RACISTE = (
            "PROPOS_RACISTE_DISCRIMINATOIRE",
            "Propos raciste ou discriminatoire",
        )

        DIFFAMATION = "DIFFAMATION", "Diffamation"

        USURPATION_IDENTITE = (
            "USURPATION_IDENTITE",
            "Usurpation d'identité",
        )

        PHOTOS_INTIMES = (
            "PHOTOS_INTIMES",
            "Publication de photos intimes ou personnelles",
        )

        VIDEOS_INTIMES = (
            "VIDEOS_INTIMES",
            "Publication de vidéos intimes ou personnelles",
        )

        MENACE_PHOTOS_INTIMES = (
            "MENACE_PHOTOS_INTIMES",
            "Menace de publier des photos intimes ou personnelles",
        )

        MENACE_VIDEOS_INTIMES = (
            "MENACE_VIDEOS_INTIMES",
            "Menace de publier des vidéos intimes ou personnelles",
        )

        AUTRES = "AUTRES", "Autres"


    class TypeContenu(models.TextChoices):
        VIDEO = "VIDEO", "Vidéo"
        IMAGE = "IMAGE", "Image"
        COMMENTAIRE = "COMMENTAIRE", "Commentaire"
        COMPTE = "COMPTE", "Compte"
        AUTRES = "AUTRES", "Autres"


    class Plateforme(models.TextChoices):
        FACEBOOK = "FACEBOOK", "Facebook"
        INSTAGRAM = "INSTAGRAM", "Instagram"
        WHATSAPP = "WHATSAPP", "WhatsApp"
        MESSENGER = "MESSENGER", "Messenger"
        TIKTOK = "TIKTOK", "Tiktok"    

    class Partenaire(models.TextChoices):
        IBNIES = "IBNIES", "IBNIES"
        ONDES = "ONDES", "ONDES"
        ATECS = "ATECS", "ATECS"

    # Étape 1 du formulaire : Concerné
    emetteur = models.CharField(
        max_length=30,
        choices=Emetteur.choices,
        verbose_name="Émetteur"
    )

    genre = models.CharField(
        max_length=30,
        choices=Genre.choices,
        null=True,
        blank=True
    )


    age = models.CharField(
        max_length=20,
        choices=Age.choices,
        null=True,
        blank=True,
    )

    cyberharcelement_type = models.CharField(
        max_length=50,
        choices=TypeCyberviolence.choices,
        verbose_name="Type de cyberviolence",
    )

    type_contenu = models.CharField(
        max_length=30,
        choices=TypeContenu.choices,
        verbose_name="Type de contenu",
    )

    plateforme = models.CharField(
        max_length=30,
        choices=Plateforme.choices,
    )

    # Étape 2 du formulaire : Contenu
    


    url = models.TextField(
        verbose_name="Lien vers le contenu"
    )

    capture_image_url = models.ImageField(
    upload_to="captures/",
    null=True,
    blank=True,
)

    # Étape 3 du formulaire : Accompagnement
    accompagnement_demande = models.BooleanField(
        default=False,
        verbose_name="Accompagnement demandé"
    )

    type_accompagnement = models.CharField(
        max_length=30,
        choices=TypeAccompagnement.choices,
        null=True,
        blank=True
    )

    nom = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    prenom = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    telephone = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    ville = models.ForeignKey(
        Ville,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="signalements"
    )

    # Suivi interne CRM
    statut = models.CharField(
        max_length=30,
        choices=Statut.choices,
        default=Statut.NOUVEAU
    )

    raison = models.TextField(
        null=True,
        blank=True,
        verbose_name="Raison / commentaire interne"
    )

    langue = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )

    partenaire = models.CharField(
        max_length=20,
        choices=Partenaire.choices,
        null=True,
        blank=True,
    )
    def clean(self):

        informations_accompagnement = (
            self.nom
            or self.prenom
            or self.telephone
            or self.ville
            or self.type_accompagnement
        )

        # Si l'utilisateur a rempli une information
        # d'accompagnement, on coche automatiquement
        # accompagnement_demande.
        if informations_accompagnement:
            self.accompagnement_demande = True

        if self.accompagnement_demande:

            erreurs = {}

            if not self.nom:
                erreurs["nom"] = (
                    "Le nom est obligatoire "
                    "si un accompagnement est demandé."
                )

            if not self.prenom:
                erreurs["prenom"] = (
                    "Le prénom est obligatoire "
                    "si un accompagnement est demandé."
                )

            if not self.telephone:
                erreurs["telephone"] = (
                    "Le téléphone est obligatoire "
                    "si un accompagnement est demandé."
                )

            if not self.ville:
                erreurs["ville"] = (
                    "La ville est obligatoire "
                    "si un accompagnement est demandé."
                )

            if not self.type_accompagnement:
                erreurs["type_accompagnement"] = (
                    "Le type d'accompagnement est obligatoire."
                )

            if erreurs:
                raise ValidationError(erreurs)

        else:
            self.nom = None
            self.prenom = None
            self.telephone = None
            self.ville = None
            self.type_accompagnement = None

    class Meta:
        verbose_name = "Signalement"
        verbose_name_plural = "Signalements"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Signalement #{self.id} - {self.statut}"


class HistoriqueSignalement(models.Model):

    signalement = models.ForeignKey(
        Signalement,
        on_delete=models.CASCADE,
        related_name="historique"
    )

    agent = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    ancien_statut = models.CharField(
        max_length=30
    )

    nouveau_statut = models.CharField(
        max_length=30
    )

    date_action = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Signalement #{self.signalement.id}"    