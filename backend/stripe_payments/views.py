from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from product.models import Product
from coupons.models import FixedPriceCoupon, PercentageCoupon
from shipping.models import Shipping
from .models import PaymentIntent

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateStripePaymentIntentView(APIView):
    def post(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data

            tax = 0.13

            try:
                shipping_id = int(data['shipping_id'])
            except:
                return Response(
                    {'error': 'Shipping ID must be an integer'},
                    status=status.HTTP_404_NOT_FOUND
                )
            coupon_name = str(data['coupon_name'])

            cart = Cart.objects.get(user=user)

            # Check to see whether user has items in their cart
            if not CartItem.objects.filter(cart=cart).exists():
                return Response(
                    {'error': 'Need to have items in cart'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cart_items = CartItem.objects.filter(cart=cart)

            # Check to see whether there is enough quantity of each item in stock
            for cart_item in cart_items:
                if not Product.objects.filter(id=cart_item.product.id).exists():
                    return Response(
                        {'error': 'Transaction failed, a proudct ID does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response(
                        {'error': 'Not enough items in stock'},
                        status=status.HTTP_200_OK
                    )

            # update our total order cost
            total_amount = 0.0

            for cart_item in cart_items:
                total_amount += (float(cart_item.product.price)
                                 * float(cart_item.count))

            # Coupon Checks
            if coupon_name != '':
                # Check whether we have a valid fixed price coupon
                if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                    fixed_price_coupon = FixedPriceCoupon.objects.get(
                        name=coupon_name
                    )
                    discount_amount = float(fixed_price_coupon.discount_price)

                    if discount_amount < total_amount:
                        total_amount -= discount_amount
                # Check whether we have a valid percentage price coupon
                elif PercentageCoupon.objects.filter(name__iexact=coupon_name).exists():
                    percentage_coupon = PercentageCoupon.objects.get(
                        name=coupon_name
                    )
                    discount_percentage = float(
                        percentage_coupon.discount_percentage)

                    if discount_percentage > 1 and discount_percentage < 100:
                        total_amount -= (total_amount *
                                         (discount_percentage / 100))

            # Add tax to total (can add tax after shipping if e-commerce store is applying tax in that way)
            total_amount += (total_amount * tax)

            if Shipping.objects.filter(id=shipping_id).exists():
                shipping = Shipping.objects.get(id=shipping_id)
                shipping_cost = shipping.price
                total_amount += float(shipping_cost)

            total_amount = round(total_amount, 2)
            total_amount *= 100
            total_amount = int(total_amount)

            if PaymentIntent.objects.filter(user=user).exists():
                payment_intent = PaymentIntent.objects.get(user=user)
                payment_intent_id = payment_intent.payment_intent_id

                intent = stripe.PaymentIntent.retrieve(
                    payment_intent_id
                )

                if intent['status'] == 'succeeded':
                    intent = stripe.PaymentIntent.create(
                        amount=total_amount,
                        currency='cad'
                    )

                    PaymentIntent.objects.filter(user=user).update(
                        payment_intent_id=intent['id']
                    )

                    return Response(
                        {'clientSecret': intent['client_secret']},
                        status=status.HTTP_200_OK
                    )
                else:
                    stripe.PaymentIntent.modify(
                        payment_intent_id,
                        amount=total_amount
                    )

                    intent = stripe.PaymentIntent.retrieve(
                        payment_intent_id
                    )

                    return Response(
                        {'clientSecret': intent['client_secret']},
                        status=status.HTTP_200_OK
                    )
            else:
                intent = stripe.PaymentIntent.create(
                    amount=total_amount,
                    currency='cad'
                )

                PaymentIntent.objects.create(
                    user=user,
                    payment_intent_id=intent['id']
                )

                return Response(
                    {'clientSecret': intent['client_secret']},
                    status=status.HTTP_200_OK
                )
        except:
            return Response(
                {'error': 'Something went wrong when creating stripe payment intent'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
