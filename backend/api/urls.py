from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, VilleViewSet, SignalementViewSet


router = DefaultRouter()

router.register(r"regions", RegionViewSet, basename="region")
router.register(r"villes", VilleViewSet, basename="ville")
router.register(r"signalements", SignalementViewSet, basename="signalement")

urlpatterns = [
    path("", include(router.urls)),
]