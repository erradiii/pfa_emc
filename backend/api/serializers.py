from rest_framework import serializers
from .models import Region, Ville, Signalement, HistoriqueSignalement


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"


class VilleSerializer(serializers.ModelSerializer):
    region_nom = serializers.CharField(source="region.nom", read_only=True)

    class Meta:
        model = Ville
        fields = "__all__"


class HistoriqueSignalementSerializer(serializers.ModelSerializer):

    agent_nom = serializers.SerializerMethodField()

    class Meta:
        model = HistoriqueSignalement
        fields = [
            "id",
            "agent_nom",
            "ancien_statut",
            "nouveau_statut",
            "date_action",
        ]
    def get_agent_nom(self, historique):

        if historique.agent:
            return historique.agent.username

        return "Agent non identifié"    

class SignalementSerializer(serializers.ModelSerializer):
    ville_nom = serializers.CharField(source="ville.nom", read_only=True)

    historique = HistoriqueSignalementSerializer(many=True,read_only=True)
    class Meta:
        model = Signalement
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")

    def validate(self, data):
        accompagnement_demande = data.get(
            "accompagnement_demande",
            getattr(self.instance, "accompagnement_demande", False)
        )

        if accompagnement_demande:
            required_fields = [
                "nom",
                "prenom",
                "telephone",
                "ville",
                "type_accompagnement",
            ]

            errors = {}

            for field in required_fields:
                value = data.get(field, getattr(self.instance, field, None))
                if not value:
                    errors[field] = "Ce champ est obligatoire si un accompagnement est demandé."

            if errors:
                raise serializers.ValidationError(errors)

        return data