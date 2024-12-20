using System.Linq;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class BasketExtention
    {
        public static BasketDto BasketDTOGetter (this Basket basket)
        {
            return new BasketDto
                {
                    Id = basket.Id,
                    BuyerId = basket.BuyerId,
                    PaymentIntentId = basket.PaymentIntentId,
                    ClientSecretForStripe = basket.ClientSecretForStripe,
                    Items = basket.Items.Select(item => new BasketItemDto
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Name = item.Product.Name,
                        Brand = item.Product.Brand,
                        Type = item.Product.TypeofProduct,
                        Price= item.Product.Price,
                        PictureUrl = item.Product.PictureUrl,
                    }).ToList()
                };
        }

        public static IQueryable<Basket> GetBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(i=> i.Items)
                         .ThenInclude(p => p.Product)
                         .Where( i => i.BuyerId == buyerId);
        }
    }
}