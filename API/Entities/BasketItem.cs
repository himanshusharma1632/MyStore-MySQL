using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")] //annotation
    //this is the individual basket item
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity {get; set;}

        //navigation to the product
         public int ProductId { get; set; }
        
        public Product Product { get; set; }

        //navigation to the Individual Basket Item
        public int BasketId { get; set; }
        public Basket Basket { get; set;}

    }
}