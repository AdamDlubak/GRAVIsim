from django.conf import settings
from rest_framework import serializers
from rest_framework.reverse import reverse
from api.serializers.user import UserSerializer
from core.models import SparkJob, SparkJobStates
import os
import shutil
import hashlib
import datetime, time


class SparkJobSerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)
    state = serializers.ChoiceField(SparkJob.STATE_TYPES, read_only=True)
    created = serializers.DateTimeField(read_only=True)
    started = serializers.DateTimeField(read_only=True)
    finished = serializers.DateTimeField(read_only=True)
    iterations = serializers.IntegerField(write_only=True)

    class Meta:
        model = SparkJob
        fields = ('id', 'name', 'description', 'inputFile',
                  'author', 'state', 'priority', 'iterations',
                  'created', 'started', 'finished', 'link')

    def get_link(self, obj):
        return self.context.get('request').build_absolute_uri(
            reverse('api:sparkjob-detail', kwargs={
                'pk': obj.pk
            })
        )

    def create(self, validated_data):
        user = self.context.get('request').user

        md = hashlib.md5()
        timestamp = int(time.mktime(datetime.datetime.utcnow().timetuple()))
        md.update(str(user.username).encode('utf-8'))
        md.update(str(timestamp).encode('utf-8'))
        filename = "{}.json".format(md.hexdigest())

        source = os.path.join(settings.MEDIA_TMP, validated_data['inputFile'])
        destiny = os.path.join(settings.MEDIA_INPUT, filename)
        shutil.copy2(source, destiny)
        os.unlink(source)

        validated_data['inputFile'] = filename
        validated_data['state'] = SparkJobStates['SUSPENDED']
        validated_data['author'] = user
        job = SparkJob.objects.create(**validated_data)
        job.save()
        return job


class SparkJobDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    created = serializers.DateTimeField(read_only=True)
    started = serializers.DateTimeField(read_only=True)
    finished = serializers.DateTimeField(read_only=True)

    class Meta:
        model = SparkJob
        fields = ('id', 'name', 'description', 'author',
                  'state', 'priority', 'iterations', 'inputFile',
                  'created', 'started', 'finished')

    def update(self, instance, validated_data):
        state = validated_data.get('state', instance.state)
        if state in [SparkJobStates['RUNNING'], SparkJobStates['FINISHED']]:
            return instance

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)

        if instance.state is SparkJobStates['SUSPENDED']:
            instance.priority = validated_data.get('priority', instance.priority)
            instance.iterations = validated_data.get('iterations', instance.iterations)
            instance.inputFile = validated_data.get('inputFile', instance.inputFile)

        instance.state = state

        instance.save()
        return instance
