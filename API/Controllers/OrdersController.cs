using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
            
        }
//getting the list of the ordered items
[HttpGet]
public async Task<ActionResult<List<OrderDTO>>> GetOrders(){
    return await _context.MyOrders
                 .ProjectOrdertoDTO()
                 .Where(x => x.BuyerId == User.Identity.Name)
                 .ToListAsync();
}

//getting the individual order with the order Id
[HttpGet("{id}", Name = "GetPackedOrder")]
public async Task<ActionResult<OrderDTO>> GetSingleOrder(int id)
{
    return await _context.MyOrders 
                .ProjectOrdertoDTO()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
}

//creating the order
[HttpPost]
public async Task<ActionResult<int>> CreateNewOrder(CreateOrderDTO orderDTO)
{
var basket = await _context.Baskets
             .GetBasketWithItems(User.Identity.Name)
             .FirstOrDefaultAsync();

// defensive check to see if basket is null or actually exist
if(basket == null)
return BadRequest(new ProblemDetails{Title=$"No Such Order Exist under name {User.Identity.Name}."});

//initialize the empty List<OrderItem>
var orderItem = new List<OrderItem>();

//checking every item into the basket whether it exists with a particular Product or not
foreach(var item in basket.Items){
//for every item into the basket.items we now have
//bring product
var productItem = await _context.Products.FindAsync(item.ProductId);
//using this productItem, update our table ProductItemOrdered
var itemOrdered = new ProductItemOrdered{
ProductId = productItem.Id,
Name = productItem.Name,
PictureUrl = productItem.PictureUrl,
};
//using the itemOrdered table now we may update our orderItems table
var orderItems = new OrderItem{
ProductItemOrdered = itemOrdered,
Price = productItem.Price, // the price of the productItem should be the actual price of the particular product
Quantity = item.Quantity, //this quantity should be exactly the same as one which is actually kept inside of the basket
 };
//now adding the changes to the context
orderItem.Add(orderItems);
//since products are taken away , we should then decrease the quantity in stock for that particular product
productItem.QuantityInStock -= item.Quantity;
}
//since subtotal has to be calculated for all the orderItems which are being kept as a list and not for the individual order item
var subTotal = orderItem.Sum(item => item.Price * item.Quantity);
//from this subTotal field , we now have to calculate the delivery fee as well - 
var deliveryFee = subTotal > 10000 ? 0 : 500;

//finally keeping everything inside of our order Table (which is the principal table) - 
var packedOrder = new Order{
BuyerId = User.Identity.Name,
DeliveryFees = deliveryFee,
Subtotal = subTotal,
OrderItems = orderItem,
ShippingAddress = orderDTO.ShippingAddress,
PaymentIntentId = basket.PaymentIntentId,
};

_context.MyOrders.Add(packedOrder);
_context.Baskets.Remove(basket);
//when the user clicks the save address button then we need to save that current address and update our user address as (new address)
if (orderDTO.SaveAddress){
    //finding the user whose userName is equal to the User.Identity.Name
    var user = await _context.Users
    .Include(ad => ad.Address)
    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
    //now populating the same user with the new address details
        var address = new UserAddress{
        FullName = orderDTO.ShippingAddress.FullName,
        Address1 = orderDTO.ShippingAddress.Address1,
        Address2 = orderDTO.ShippingAddress.Address2,
        City = orderDTO.ShippingAddress.City,
        State = orderDTO.ShippingAddress.State,
        Country = orderDTO.ShippingAddress.Country,
        ZipCode = orderDTO.ShippingAddress.ZipCode,
    };
     user.Address = address;
    //updating our context containing the old user with the new user's address details
    //_context.Update(user);
}
//changes must now be saved > 0
var result = await _context.SaveChangesAsync() > 0;
//checking if there is result == success
if (result) return CreatedAtRoute("GetPackedOrder", new {id = packedOrder.Id}, packedOrder.Id);
//if the result is not succeeded
return BadRequest(new ProblemDetails{ Title = "Failed to create your Order"});
}
    }
}