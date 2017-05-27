from django.conf.urls import url, include
from rest_framework import routers
from api.viewsets.user import UserViewSet
from api.viewsets.spark_job import SparkJobViewSet
from api.views import FileUploadView
from django.views.decorators.csrf import csrf_exempt

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'spark-jobs', SparkJobViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^upload_data/$', csrf_exempt(FileUploadView.as_view())),
    
]
