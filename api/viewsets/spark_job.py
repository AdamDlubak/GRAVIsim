from core.models import SparkJob
from api.serializers.spark_job import SparkJobSerializer, SparkJobDetailSerializer, SparkJobSummarySerializer
from api.baseview import DefaultsMixin
from rest_framework import permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response


class AuthenticatedIsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author.id is request.user.id


class SparkJobViewSet(DefaultsMixin):
    permission_classes = (AuthenticatedIsOwnerOrReadOnly,)
    queryset = SparkJob.objects.all()
    ordering = ('priority', '-created')
    filter_fields = ('id', 'state', 'author')

    def get_serializer_class(self):
        if self.action is 'summary':
            return SparkJobSummarySerializer
        elif self.action is 'list' or self.action is 'create':
            return SparkJobSerializer
        else:
            return SparkJobDetailSerializer

    @list_route(methods=['get'])
    def summary(self, request):
        jobs = SparkJob.objects.filter(state=2).order_by('id')
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
