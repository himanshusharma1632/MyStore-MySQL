using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class OrderExtention
    {
       public static IQueryable<OrderDTO> ProjectOrdertoDTO(this IQueryable<Order> query){
        return query.Select(mainOrder => new OrderDTO {
            Id = mainOrder.Id,
            BuyerId = mainOrder.BuyerId,
            DeliveryFees = mainOrder.DeliveryFees,
            Subtotal = mainOrder.Subtotal,
            Total = mainOrder.GetTotal(),
            OrderDate = mainOrder.OrderDate,
            OrderStatus = mainOrder.OrderStatus.ToString(),
            ShippingAddress = mainOrder.ShippingAddress,
            OrderItems = mainOrder.OrderItems.Select(item => new OrderItemDTO {
                ProductId = item.ProductItemOrdered.ProductId,
                Name = item.ProductItemOrdered.Name,
                PictureUrl = item.ProductItemOrdered.PictureUrl,
                Description = item.ProductItemOrdered.Description,
                Price = item.Price,
                Quantity = item.Quantity,
                Brand = item.ProductItemOrdered.Brand,
                TypeofProduct = item.ProductItemOrdered.TypeofProduct
            }).ToList()
        }).AsNoTracking();
       } 
    }
}