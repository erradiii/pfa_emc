from rest_framework import viewsets
from .models import Region, Ville, Signalement
from .serializers import RegionSerializer, VilleSerializer, SignalementSerializer


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class VilleViewSet(viewsets.ModelViewSet):
    queryset = Ville.objects.select_related("region").all()
    serializer_class = VilleSerializer


class SignalementViewSet(viewsets.ModelViewSet):
    queryset = Signalement.objects.select_related("ville").all()
    serializer_class = SignalementSerializer