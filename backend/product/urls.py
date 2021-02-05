from django.urls import path
from .views import ReadProductView, ListProductsView, ListSearchView, ListRelatedView, ListBySearchView

urlpatterns = [
    path('product/<productId>', ReadProductView.as_view()),
    path('get-products', ListProductsView.as_view()),
    path('search', ListSearchView.as_view()),
    path('related/<productId>', ListRelatedView.as_view()),
    path('by/search', ListBySearchView.as_view()),
]
