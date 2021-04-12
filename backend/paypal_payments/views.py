from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem
from product.models import Product
from shipping.models import Shipping
from coupons.models import FixedPriceCoupon, PercentageCoupon
from django.core.mail import send_mail

client_id = settings.PAYPAL_CLIENT_ID
client_secret = settings.PAYPAL_SECRET_ID

environment = SandboxEnvironment(
    client_id=client_id, client_secret=client_secret)
client = PayPalHttpClient(environment)


class CreatePayPalOrderView(APIView):
    def post(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data

            tax = 0.13

            try:
                shipping_id = int(data['shipping_id'])
            except:
                return Resopnse(
                    {'error': 'Shipping ID must be an integer'},
                    status=status.HTTP_404_NOT_FOUND
                )

            coupon_name = data['coupon_name']

            if not Shipping.objects.filter(id=shipping_id).exists():
                return Response(
                    {'error': 'Must use a valid shipping ID'},
                    status=status.HTTP_404_NOT_FOUND
                )

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

            # Add shipping cost to total amount
            shipping = Shipping.objects.get(id=shipping_id)

            # Shipping name, time to delivery, and price we want a record of
            shipping_price = shipping.price

            # Actual Total Amount
            total_amount += float(shipping_price)
            total_amount = round(total_amount, 2)
            total_amount = str(total_amount)

            request = OrdersCreateRequest()

            request.prefer('return=representation')

            request.request_body(
                {
                    'intent': 'CAPTURE',
                    'purchase_units': [
                        {
                            'amount': {
                                'currency_code': 'CAD',
                                'value': total_amount
                            }
                        }
                    ],
                    'application_context': {'shipping_preference': 'NO_SHIPPING'}
                }
            )

            response = client.execute(request)

            return Response(
                {'paymentId': response.result.id},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when creating PayPal order'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ApprovePayPalOrderView(APIView):
    def post(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data

            tax = 0.13

            try:
                shipping_id = int(data['shipping_id'])
            except:
                return Resopnse(
                    {'error': 'Shipping ID must be an integer'},
                    status=status.HTTP_404_NOT_FOUND
                )

            coupon_name = data['coupon_name']

            approve_order_id = data['approve_order_id']

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
                    {'error': 'Must use a valid shipping ID'},
                    status=status.HTTP_404_NOT_FOUND
                )

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

            # Add shipping cost to total amount
            shipping = Shipping.objects.get(id=int(shipping_id))

            # Shipping name, time to delivery, and price we want a record of
            shipping_name = shipping.name
            shipping_time = shipping.time_to_delivery
            shipping_price = shipping.price

            # Actual Total Amount
            total_amount += float(shipping_price)
            total_amount = round(total_amount, 2)

            request = OrdersCaptureRequest(approve_order_id)

            response = client.execute(request)
            order_id = response.result.id

            if response.result.status == 'COMPLETED':
                for cart_item in cart_items:
                    # Get product object to update
                    update_product = Product.objects.get(
                        id=cart_item.product.id)

                    # Find quantity after purchase
                    quantity = int(update_product.quantity) - \
                        int(cart_item.count)

                    # Get the amount that will be sold
                    sold = int(update_product.sold) + int(cart_item.count)

                    # Update the product
                    Product.objects.filter(id=cart_item.product.id).update(
                        quantity=quantity, sold=sold
                    )

                try:
                    order = Order.objects.create(
                        user=user,
                        transaction_id=order_id,
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
            else:
                return Response(
                    {'error': 'Transaction failed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when approving PayPal order'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
