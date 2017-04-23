from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
from django.views.generic import TemplateView


class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class Homepage(TemplateView):
    template_name = "index.html"    
    
class CategoryListView(TemplateView):
    template_name = "category-list.html"    
    
class CategoryDetailView(TemplateView):
    template_name = "category-detail.html" 