using System;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
            
        }

        //endpoints for basket
        //endpoint 1 for getting the basket item from server
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await BasketGetter(GetBuyerId());
            if (basket == null) return NotFound();
            return basket.BasketDTOGetter();

        }

        //An endpoint for adding the basket item to the server 
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddBasketItem(int productId, int quantity)
        {
            //get the basket(new variable basketgetter)
            var basket = await BasketGetter(GetBuyerId());


            //if basket is not found then create the basket
            if(basket == null) basket = BasketCreater();

            //get the product
            var productgetter = await _context.Products.FindAsync(productId);
            //if there is no product into the basket
            if(productgetter == null) return 
            NotFound(new ProblemDetails{Title="Your Product is not found!"});

            //add the item
            basket.AddItem(productgetter, quantity);
            //save the changes
            var overallResult =await _context.SaveChangesAsync() > 0;

            //if result is get
            if(overallResult) return 
                   
            CreatedAtRoute("GetBasket", basket.BasketDTOGetter());
          
            //otherwise return
            return BadRequest(new ProblemDetails{Title ="Problem saving to basket!"});
        }

        //An Endpoint to remove the item from the server/basket
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //get basket
            var basket = await BasketGetter(GetBuyerId());
            if(basket == null) return NotFound(new ProblemDetails{Title="No Such Basket!"});
              basket.RemoveItem(productId, quantity);
            //remove the basket or reduce the quantity
            var result = await _context.SaveChangesAsync()>0;
            //save the changes
            if (result)
            return Ok();

            //else
            return BadRequest(new ProblemDetails{Title="No Items into the Basket !"});
        }

        

        private Basket BasketCreater()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)){
                //first generate a random Guid(Global identifier)
                buyerId = Guid.NewGuid().ToString() + "_created_" + DateTime.Now.ToString("yymmdd");

                //then generate cookie to carry that guid
                //this cookie options will only carry the Guid with it for 30 days and 12 hours
                var CookieOptions = new
                CookieOptions{IsEssential= true, Expires = DateTime.Now.AddDays(30).AddHours(12)};

                
                //Append that CookieOptions+Guid to Http Response from API
                Response.Cookies.Append("buyerId", buyerId, CookieOptions);
            }

            //Add it into the basket
            var basket= new Basket{BuyerId= buyerId};

            //Help the Ef to track this basket
            _context.Baskets.Add(basket);

            //return this basket to client
            return basket;

        }
     
         //this is the basket getter method(out of endpoints)
         private async Task<Basket> BasketGetter(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)){
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                        .Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);

        }

        private string GetBuyerId(){
         return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }
 
    }
}