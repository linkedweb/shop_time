from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class PaymentIntent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    payment_intent_id = models.CharField(max_length=255)
