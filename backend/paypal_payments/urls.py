from django.urls import path
from .views import CreatePayPalOrderView, ApprovePayPalOrderView

urlpatterns = [
    path('create-order', CreatePayPalOrderView.as_view()),
    path('approve-order', ApprovePayPalOrderView.as_view()),
]
