# from rest_framework import generics
# from django.contrib.auth.models import User
# from .serializers import CategorySerializer
# from django.views.generic import TemplateView


# class UserList(generics.ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# class UserDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
    
# class Homepage(TemplateView):
#     template_name = "index.html"    
    
# class CategoryListView(TemplateView):
#     template_name = "users.html"    
    
# class CategoryDetailView(TemplateView):
#     template_name = "user-details.html" 