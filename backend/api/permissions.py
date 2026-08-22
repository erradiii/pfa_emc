from rest_framework.permissions import BasePermission, SAFE_METHODS


class PermissionSignalement(BasePermission):

    def has_permission(self, request, view):

        user = request.user

        # Les utilisateurs non connectés sont refusés
        if not user or not user.is_authenticated:
            return False

        # Les partenaires peuvent seulement consulter
        if user.groups.filter(
            name__startswith="PARTENAIRE_"
        ).exists():

            return request.method in SAFE_METHODS

        # Les autres utilisateurs authentifiés
        # peuvent accéder au signalement
        return True