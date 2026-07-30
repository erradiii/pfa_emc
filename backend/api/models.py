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
        AUTRE = "AUTRE", "Autre"
        NON_PRECISE = "NON_PRECISE", "Non précisé"

    class Statut(models.TextChoices):
        NOUVEAU = "NOUVEAU", "Nouveau"
        EN_COURS = "EN_COURS", "En cours"
        RESOLU = "RESOLU", "Résolu"

    class TypeAccompagnement(models.TextChoices):
        JURIDIQUE = "JURIDIQUE", "Juridique"
        PSYCHIQUE = "PSYCHIQUE", "Psychique"

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
        max_length=100,
        null=True,
        blank=True
    )

    # Étape 2 du formulaire : Contenu
    cyberharcelement_type = models.CharField(
        max_length=255,
        verbose_name="Type de cyberviolence"
    )

    type_contenu = models.CharField(
        max_length=255,
        verbose_name="Type de contenu"
    )

    plateforme = models.CharField(
        max_length=255
    )

    url = models.TextField(
        verbose_name="Lien vers le contenu"
    )

    capture_image_url = models.TextField(
        null=True,
        blank=True,
        verbose_name="Capture image"
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

    def clean(self):
        """
        Validation métier :
        Si accompagnement demandé, alors les informations personnelles deviennent obligatoires.
        Sinon, elles doivent rester vides.
        """

        if self.accompagnement_demande:
            erreurs = {}

            if not self.nom:
                erreurs["nom"] = "Le nom est obligatoire si un accompagnement est demandé."

            if not self.prenom:
                erreurs["prenom"] = "Le prénom est obligatoire si un accompagnement est demandé."

            if not self.telephone:
                erreurs["telephone"] = "Le téléphone est obligatoire si un accompagnement est demandé."

            if not self.ville:
                erreurs["ville"] = "La ville est obligatoire si un accompagnement est demandé."

            if not self.type_accompagnement:
                erreurs["type_accompagnement"] = "Le type d'accompagnement est obligatoire."

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