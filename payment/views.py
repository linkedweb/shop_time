from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from coupons.models import FixedPriceCoupon, PercentageCoupon
from orders.models import Order, OrderItem
from product.models import Product
from shipping.models import Shipping
from django.core.mail import send_mail
import braintree

gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=settings.BT_ENVIRONMENT,
        merchant_id=settings.BT_MERCHANT_ID,
        public_key=settings.BT_PUBLIC_KEY,
        private_key=settings.BT_PRIVATE_KEY
    )
)


class GenerateTokenView(APIView):
    def get(self, request, format=None):
        try:
            token = gateway.client_token.generate()

            return Response(
                {'braintree_token': token},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving braintree token'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetPaymentTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        tax = 0.13

        shipping_id = request.query_params.get('shipping_id')
        shipping_id = str(shipping_id)

        coupon_name = request.query_params.get('coupon_name')
        coupon_name = str(coupon_name)

        try:
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
                        {'error': 'A proudct with ID provided does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response(
                        {'error': 'Not enough items in stock'},
                        status=status.HTTP_200_OK
                    )

            # update our total order cost
            total_amount = 0.0
            total_compare_amount = 0.0

            for cart_item in cart_items:
                total_amount += (float(cart_item.product.price)
                                 * float(cart_item.count))
                total_compare_amount += (float(cart_item.product.compare_price)
                                         * float(cart_item.count))

            total_compare_amount = round(total_compare_amount, 2)
            original_price = round(total_amount, 2)

            total_after_coupon = total_amount

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
                        total_after_coupon = total_amount
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
                        total_after_coupon = total_amount

            # Total After Coupon Applied
            total_after_coupon = round(total_after_coupon, 2)

            # Estimated Tax Cost
            estimated_tax = round(total_amount * tax, 2)

            # Add tax to total (can add tax after shipping if e-commerce store is applying tax in that way)
            total_amount += (total_amount * tax)

            shipping_cost = 0.0
            # Check whether shipping id is valid
            if Shipping.objects.filter(id__iexact=shipping_id).exists():
                # Add shipping cost to total amount
                shipping = Shipping.objects.get(id=shipping_id)
                shipping_cost = shipping.price
                total_amount += float(shipping_cost)

            # Actual Total Amount
            total_amount = round(total_amount, 2)

            return Response(
                {
                    'original_price': f'{original_price:.2f}',
                    'total_after_coupon': f'{total_after_coupon:.2f}',
                    'total_amount': f'{total_amount:.2f}',
                    'total_compare_amount': f'{total_compare_amount:.2f}',
                    'estimated_tax': f'{estimated_tax:.2f}',
                    'shipping_cost': f'{shipping_cost:.2f}'
                },
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving payment total information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProcessPaymentView(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data

        tax = 0.13

        nonce = data['nonce']
        shipping_id = str(data['shipping_id'])
        coupon_name = str(data['coupon_name'])

        full_name = data['full_name']
        address_line_1 = data['address_line_1']
        address_line_2 = data['address_line_2']
        city = data['city']
        state_province_region = data['state_province_region']
        postal_zip_code = data['postal_zip_code']
        country_region = data['country_region']
        telephone_number = data['telephone_number']

        # Check whether shipping id is valid
        if not Shipping.objects.filter(id__iexact=shipping_id).exists():
            return Response(
                {'error': 'Invalid shipping option'},
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

        try:
            # Make a transaction
            newTransaction = gateway.transaction.sale(
                {
                    'amount': str(total_amount),
                    'payment_method_nonce': str(nonce['nonce']),
                    'options': {
                        'submit_for_settlement': True
                    }
                }
            )
        except:
            return Response(
                {'error': 'Error processing the transaction'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if newTransaction.is_success and newTransaction.transaction:
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
                    transaction_id=newTransaction.transaction.id,
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

            order_items = OrderItem.objects.filter(order=order)
            order_item_text = '\n\nOrder Item Details:'
            order_item_count = 1

            for order_item in order_items:
                order_item_text += '\n\nOrder Item ' + \
                    str(order_item_count) + ':'
                order_item_text += '\nOrder Item Name: ' + str(order_item.name)
                order_item_text += '\nOrder Item Price: $' + \
                    str(order_item.price)
                order_item_text += '\nOrder Item Count: ' + \
                    str(order_item.count)
                order_item_count += 1

            try:
                send_mail(
                    'Your Order Details',
                    'Hi ' + full_name + ','
                    + '\n\nWe recieved your order!'
                    + '\n\nGive us some time to process your order and ship it out to you.'
                    + '\n\nYou can go on your user dashboard to check the status of your order.'
                    + '\n\nHere are the details of your order:'
                    + '\nOrder Transaction ID: ' +
                    str(newTransaction.transaction.id)
                    + '\nOrder Total: $' + str(total_amount)
                    + '\nCoupon Used: ' + str(coupon_name)
                    + '\n\nShipping Details:'
                    + '\nAddress Line 1: ' + address_line_1
                    + '\nAddress Line 2: ' + address_line_2
                    + '\nCity: ' + city
                    + '\nState/Province/Region: ' + state_province_region
                    + '\nPostal/Zip Code: ' + postal_zip_code
                    + '\nCountry/Region: ' + country_region
                    + '\n\nPhone Number: ' + telephone_number
                    + '\n\nShipping Option Details:'
                    + '\nShipping Name: ' + shipping_name
                    + '\nShipping Price: $' + str(shipping_price)
                    + order_item_text
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
                send_mail(
                    'An Order Was Created',
                    'Hi, you are receiving this notification because an order was made on your website.'
                    + '\n\nOrder Details of the user that made the order are the following:'
                    + '\n\nFull Name: ' + full_name
                    + '\nEmail: ' + user.email
                    + '\nOrder Transaction ID: ' +
                    str(newTransaction.transaction.id)
                    + '\nOrder Total: $' + str(total_amount)
                    + '\nCoupon Used: ' + str(coupon_name)
                    + '\n\nShipping Details:'
                    + '\nAddress Line 1: ' + address_line_1
                    + '\nAddress Line 2: ' + address_line_2
                    + '\nCity: ' + city
                    + '\nState/Province/Region: ' + state_province_region
                    + '\nPostal/Zip Code: ' + postal_zip_code
                    + '\nCountry/Region: ' + country_region
                    + '\n\nPhone Number: ' + telephone_number
                    + '\n\nShipping Option Details:'
                    + '\nShipping Name: ' + shipping_name
                    + '\nShipping Price: $' + str(shipping_price)
                    + order_item_text,
                    'johndoe1357933@gmail.com',
                    ['johndoe1357933@gmail.com'],
                    fail_silently=False
                )
            except:
                pass

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
