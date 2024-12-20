using System;
using System.Collections.Generic;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public long DeliveryFees { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public string PaymentIntentId { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.isPending;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public long Subtotal { get; set; }

        public long GetTotal() {
           return DeliveryFees + Subtotal;
        }
    }
   
}