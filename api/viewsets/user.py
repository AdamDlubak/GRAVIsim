from django.contrib.auth.models import User
from api.serializers.user import UserListSerializer, UserDetailSerializer
from api.baseview import DefaultsMixin
from api.permission import IsOwnerOrReadOnly


class UserViewSet(DefaultsMixin):
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = User.objects.all()
    ordering = ('last_name', 'first_name', 'id')
    filter_fields = ('id', 'email', 'username')
    search_fields = ('first_name', 'last_name', 'email', 'username')

    def get_serializer_class(self):
        if self.action is 'list' or self.action is 'create':
            return UserListSerializer
        else:
            return UserDetailSerializer
