from django.conf import settings
from rest_framework import views
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import hashlib
import os

class FileUploadView(views.APIView):
    parser_class = (FileUploadParser,)
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        md = hashlib.md5()
        md.update(str(request.user.email).encode('utf-8'))
        filename = "{}.json".format(md.hexdigest())

        with open(os.path.join(settings.MEDIA_TMP, filename), 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)

        return Response({ 'filename': filename }, status=201)
