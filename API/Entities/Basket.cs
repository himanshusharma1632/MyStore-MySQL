using System.Collections.Generic;
using System.Linq;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }

        public string PaymentIntentId { get; set; }
        public string ClientSecretForStripe { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        //for adding an item into the basket items
        public void AddItem(Product product , int quantity)
        {
         if(Items.All(item=> item.ProductId != product.Id))
           {
               Items.Add(new BasketItem{Product = product, Quantity= quantity});
           }
          
          //this will check if there is any existing item in the basket or not
           var ExistingItem = Items.FirstOrDefault(item=> item.ProductId == product.Id);
           if(ExistingItem !=null)
           {
            ExistingItem.Quantity = ExistingItem.Quantity + quantity;
           }

        }

        //removing the item from basket
        public void RemoveItem(int ProductId, int quantity)
        {
          var item = Items.FirstOrDefault(item=> item.ProductId == ProductId);
          if(item == null) return;
            item.Quantity = item.Quantity-quantity;
           if(item.Quantity == 0)
           {
               Items.Remove(item);
           }
            
        }
    }
}