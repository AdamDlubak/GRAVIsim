from rest_framework import authentication, permissions
from rest_framework import viewsets
from rest_framework import filters
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class DefaultsMixin(viewsets.ModelViewSet):
    authentication_classes = (
        authentication.SessionAuthentication,
        JSONWebTokenAuthentication
    )
    permission_classes = (
        permissions.IsAuthenticated,
    )
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)


class ReadOnlyDefaultsMixin(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (
        authentication.SessionAuthentication,
        JSONWebTokenAuthentication
    )
    permission_classes = (
        permissions.IsAuthenticated,
    )
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
