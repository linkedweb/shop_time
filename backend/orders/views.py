from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from product.models import Product
from .models import Order, OrderItem
from shipping.models import Shipping
from stripe_payments.models import PaymentIntent
from django.core.mail import send_mail

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class ListOrdersView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            # Retrieve the user's orders and order them by the date
            orders = Order.objects.order_by('-date_issued').filter(user=user)

            # This will be where we store the orders and what we send back to the frontend
            result = []

            for order in orders:
                # The order itself
                item = {}

                item['status'] = order.status
                item['transaction_id'] = order.transaction_id
                item['amount'] = order.amount
                item['shipping_price'] = order.shipping_price
                item['date_issued'] = order.date_issued

                result.append(item)

            return Response(
                {'orders': result},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving orders'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListOrderDetailView(APIView):
    def get(self, request, transactionId, format=None):
        user = self.request.user

        try:
            # Check to see if any order with user and transaction id exists
            if Order.objects.filter(user=user, transaction_id=transactionId).exists():
                # Retrieve the user's orders and order them by the date
                order = Order.objects.get(
                    user=user, transaction_id=transactionId)

                # This will be where we store the orders and what we send back to the frontend
                result = {}

                result['status'] = order.status
                result['transaction_id'] = order.transaction_id
                result['amount'] = order.amount
                result['full_name'] = order.full_name
                result['address_line_1'] = order.address_line_1
                result['address_line_2'] = order.address_line_2
                result['city'] = order.city
                result['state_province_region'] = order.state_province_region
                result['postal_zip_code'] = order.postal_zip_code
                result['country_region'] = order.country_region
                result['telephone_number'] = order.telephone_number
                result['shipping_name'] = order.shipping_name
                result['shipping_time'] = order.shipping_time
                result['shipping_price'] = order.shipping_price
                result['date_issued'] = order.date_issued

                order_items = OrderItem.objects.order_by(
                    '-date_added').filter(order=order)

                # The order items associated with the order
                result['order_items'] = []

                for order_item in order_items:
                    # The order item
                    sub_item = {}

                    sub_item['name'] = order_item.name
                    sub_item['price'] = order_item.price
                    sub_item['count'] = order_item.count

                    result['order_items'].append(sub_item)

                return Response(
                    {'order': result},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Order with this transaction ID does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving order detail'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateOrderView(APIView):
    def post(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data

            if not PaymentIntent.objects.filter(user=user).exists():
                return Response(
                    {'error': 'Payment Intent does not exist'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payment_intent = PaymentIntent.objects.get(user=user)
            payment_intent_id = payment_intent.payment_intent_id

            intent = stripe.PaymentIntent.retrieve(
                payment_intent_id
            )

            if not intent['status'] == 'succeeded':
                return Response(
                    {'error': 'Cannot create order without a successful payment'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            transaction_id = intent['id']
            total_amount = intent['amount']
            total_amount = float(total_amount)
            total_amount /= 100
            total_amount = round(total_amount, 2)

            try:
                shipping_id = int(data['shipping_id'])
            except:
                return Response(
                    {'error': 'Shipping ID must be an integer'},
                    status=status.HTTP_404_NOT_FOUND
                )

            full_name = data['full_name']
            address_line_1 = data['address_line_1']
            address_line_2 = data['address_line_2']
            city = data['city']
            state_province_region = data['state_province_region']
            postal_zip_code = data['postal_zip_code']
            country_region = data['country_region']
            telephone_number = data['telephone_number']

            if not Shipping.objects.filter(id=shipping_id).exists():
                return Response(
                    {'error': 'Shipping ID not valid'},
                    status=status.HTTP_404_NOT_FOUND
                )

            shipping = Shipping.objects.get(id=shipping_id)

            shipping_name = shipping.name
            shipping_time = shipping.time_to_delivery
            shipping_price = shipping.price

            cart = Cart.objects.get(user=user)
            cart_items = CartItem.objects.filter(cart=cart)

            for cart_item in cart_items:
                # Get product object to update
                update_product = Product.objects.get(id=cart_item.product.id)

                # Find quantity after purchase
                quantity = int(update_product.quantity) - int(cart_item.count)

                # Get the amount that will be sold
                sold = int(update_product.sold) + int(cart_item.count)

                # Update the product
                Product.objects.filter(id=cart_item.product.id).update(
                    quantity=quantity, sold=sold
                )

            try:
                order = Order.objects.create(
                    user=user,
                    transaction_id=transaction_id,
                    amount=total_amount,
                    full_name=full_name,
                    address_line_1=address_line_1,
                    address_line_2=address_line_2,
                    city=city,
                    state_province_region=state_province_region,
                    postal_zip_code=postal_zip_code,
                    country_region=country_region,
                    telephone_number=telephone_number,
                    shipping_name=shipping_name,
                    shipping_time=shipping_time,
                    shipping_price=float(shipping_price)
                )
            except:
                return Response(
                    {'error': 'Transaction succeeded but failed to create the order'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            for cart_item in cart_items:
                try:
                    # Get the product instance
                    product = Product.objects.get(id=cart_item.product.id)

                    OrderItem.objects.create(
                        product=product,
                        order=order,
                        name=product.name,
                        price=cart_item.product.price,
                        count=cart_item.count
                    )
                except:
                    return Response(
                        {'error': 'Transaction succeeded and order created, but failed to create an order item'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            try:
                send_mail(
                    'Your Order Details',
                    'Hey ' + full_name + ','
                    + '\n\nWe recieved your order!'
                    + '\n\nGive us some time to process your order and ship it out to you.'
                    + '\n\nYou can go on your user dashboard to check the status of your order.'
                    + '\n\nSincerely,'
                    + '\nShop Time',
                    'johndoe1357933@gmail.com',
                    [user.email],
                    fail_silently=False
                )
            except:
                return Response(
                    {'error': 'Transaction succeeded and order created, but failed to send email'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Empty the Cart
                CartItem.objects.filter(cart=cart).delete()

                # Update cart to have no items
                Cart.objects.filter(user=user).update(total_items=0)
            except:
                return Response(
                    {'error': 'Transaction succeeded and order successful, but failed to clear cart'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response(
                {'success': 'Transaction successful and order was created'},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when creating order'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
