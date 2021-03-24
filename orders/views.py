from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem


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
