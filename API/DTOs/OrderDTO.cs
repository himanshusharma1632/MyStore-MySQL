using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDTO //this is going to be sent to client
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public long DeliveryFees { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public long Subtotal { get; set; }
        public long Total { get; set; }
    }
}