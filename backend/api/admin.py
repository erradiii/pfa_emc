from django.contrib import admin
from .models import Region, Ville, Signalement


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("id", "nom", "created_at", "updated_at")
    search_fields = ("nom",)


@admin.register(Ville)
class VilleAdmin(admin.ModelAdmin):
    list_display = ("id", "nom", "region", "created_at", "updated_at")
    search_fields = ("nom",)
    list_filter = ("region",)


@admin.register(Signalement)
class SignalementAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "emetteur",
        "cyberharcelement_type",
        "type_contenu",
        "plateforme",
        "accompagnement_demande",
        "type_accompagnement",
        "statut",
        "created_at",
    )

    list_filter = (
        "statut",
        "plateforme",
        "accompagnement_demande",
        "type_accompagnement",
        "created_at",
    )

    search_fields = (
        "cyberharcelement_type",
        "type_contenu",
        "plateforme",
        "url",
        "nom",
        "prenom",
        "telephone",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        ("Concerné", {
            "fields": (
                "emetteur",
                "genre",
                "age",
            )
        }),
        ("Contenu signalé", {
            "fields": (
                "cyberharcelement_type",
                "type_contenu",
                "plateforme",
                "url",
                "capture_image_url",
            )
        }),
        ("Accompagnement", {
            "fields": (
                "accompagnement_demande",
                "type_accompagnement",
                "nom",
                "prenom",
                "telephone",
                "ville",
            )
        }),
        ("Suivi interne EMC", {
            "fields": (
                "statut",
                "raison",
                "langue",
            )
        }),
        ("Dates", {
            "fields": (
                "created_at",
                "updated_at",
            )
        }),
    )