from rest_framework import viewsets
from .models import Region, Ville, Signalement, HistoriqueSignalement
from .serializers import RegionSerializer, VilleSerializer, SignalementSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .permissions import PermissionSignalement


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class VilleViewSet(viewsets.ModelViewSet):
    queryset = Ville.objects.select_related("region").all()
    serializer_class = VilleSerializer


class SignalementViewSet(viewsets.ModelViewSet):

    serializer_class = SignalementSerializer
    permission_classes = [PermissionSignalement]

    def get_queryset(self):

        user = self.request.user

        role = get_role(user)

        signalements = Signalement.objects.select_related(
            "ville"
        ).all()

        if role == "PARTENAIRE_IBNIES":
            return signalements.filter(
                partenaire="IBNIES"
            )

        if role == "PARTENAIRE_ONDES":
            return signalements.filter(
                partenaire="ONDES"
            )

        if role == "PARTENAIRE_ATECS":
            return signalements.filter(
                partenaire="ATECS"
            )

        return signalements

    

    

    def perform_update(self, serializer):

        signalement = self.get_object()

        ancien_statut = signalement.statut

        nouveau_statut = serializer.validated_data.get(
            "statut",
            ancien_statut
        )

        role = get_role(self.request.user)

        if ancien_statut != nouveau_statut:

            if not statut_autorise(
                role,
                nouveau_statut
            ):
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied(
                    "Vous n'avez pas la permission de faire ce changement de statut."
                )

        signalement_modifie = serializer.save()

        if ancien_statut != nouveau_statut:

            HistoriqueSignalement.objects.create(
                signalement=signalement_modifie,
                agent=self.request.user,
                ancien_statut=ancien_statut,
                nouveau_statut=nouveau_statut,
            )



def get_role(user):

    if user.groups.filter(
        name="ADMIN_EMC"
    ).exists():
        return "ADMIN_EMC"

    if user.groups.filter(
        name="AGENT_APPROBATION"
    ).exists():
        return "AGENT_APPROBATION"

    if user.groups.filter(
        name="AGENT_ANALYSE"
    ).exists():
        return "AGENT_ANALYSE"

    if user.groups.filter(
        name="PARTENAIRE_IBNIES"
    ).exists():
        return "PARTENAIRE_IBNIES"

    if user.groups.filter(
        name="PARTENAIRE_ONDES"
    ).exists():
        return "PARTENAIRE_ONDES"

    if user.groups.filter(
        name="PARTENAIRE_ATECS"
    ).exists():
        return "PARTENAIRE_ATECS"

    return "AUCUN_ROLE"

def statut_autorise(role, nouveau_statut):

    if role == "ADMIN_EMC":
        return True

    if role == "AGENT_APPROBATION":
        statuts_autorises = [
            "NOUVEAU",
            "EN_ANALYSE",
            "EN_APPROBATION",
            "APPROUVE",
            "REJETE",
        ]

        return nouveau_statut in statuts_autorises

    if role == "AGENT_ANALYSE":
        statuts_autorises = [
            "NOUVEAU",
            "EN_ANALYSE",
            "EN_APPROBATION",
        ]

        return nouveau_statut in statuts_autorises

    return False

# Route GET /api/me/
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):

    role = get_role(request.user)

    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "role": role,
    })


