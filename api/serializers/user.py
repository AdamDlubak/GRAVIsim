from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.models import User


class UserListSerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_superuser', 'link')

    def get_link(self, obj):
        return self.context.get('request').build_absolute_uri(
            reverse('api:user-detail', kwargs={
                'pk': obj.pk
            })
        )

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser')

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'link')

    def get_link(self, obj):
        return self.context.get('request').build_absolute_uri(
            reverse('api:user-detail', kwargs={
                'pk': obj.pk
            })
        )
