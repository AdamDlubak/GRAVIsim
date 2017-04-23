"""GRAVIsim URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework_jwt.views import obtain_jwt_token
from django.contrib.auth.views import login, logout
import rest_framework.urls
from rest_framework import routers
import api.urls
from core import views

urlpatterns = [
    url(r'^api/', include(api.urls, namespace='api')),
    url(r'^api-auth/', include(rest_framework.urls, namespace='rest_framework')),
    url(r'^api-token-auth/', obtain_jwt_token),

  #  url(r'^login/$', 'django.contrib.auth.views.login'),
  #  url(r'^logout/$', 'django.contrib.auth.views.logout'),

    url(r'^admin/', include(admin.site.urls)),


    # url(r'^admin/', admin.site.urls),
    url(r'^simulate/$', TemplateView.as_view(template_name='index.html'), name='simulate'),
    url(r'^about/$', TemplateView.as_view(template_name='index.html'), name='about'),
    url(r'^my-account/$', TemplateView.as_view(template_name='index.html'), name='my-account'),
    url(r'^my-dashboard/$', TemplateView.as_view(template_name='index.html'), name='my-dashboard'),
    url(r'^current-tasks/$', TemplateView.as_view(template_name='index.html'), name='current-tasks'),
    url(r'^completed-tasks/$', TemplateView.as_view(template_name='index.html'), name='completed-tasks'),
    url(r'^order-task-with-file/$', TemplateView.as_view(template_name='index.html'), name='order-task-with-file'),
    url(r'^order-task-manually/$', TemplateView.as_view(template_name='index.html'), name='order-task-manually'),
    url(r'^contact/$', TemplateView.as_view(template_name='index.html'), name='contact'),
    url(r'^login/$', TemplateView.as_view(template_name='index.html'), name='login'),
    url(r'^users/$', TemplateView.as_view(template_name='index.html'), name='users'),
    url(r'^demo/logger/$', TemplateView.as_view(template_name='index.html'), name='demo-logger'),
    url(r'^demo/canvas/$', TemplateView.as_view(template_name='index.html'), name='demo-canvas'),
    url(r'^$', TemplateView.as_view(template_name='login.html'), name='index'),
    url(r'^401/$', TemplateView.as_view(template_name='login.html'), name='401'),
]
