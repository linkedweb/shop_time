from django.urls import path
from .views import CreateStripePaymentIntentView

urlpatterns = [
    path('create-payment-intent', CreateStripePaymentIntentView.as_view()),
]
