using System.IO;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        private readonly IConfiguration _configuration;
        public PaymentController( StoreContext context,
                                  PaymentService paymentService,
                                  IConfiguration configuration)
        {
            _configuration = configuration;
            _paymentService = paymentService;
            _context = context;
        }

//endpoint for posting the payments
[Authorize]
[HttpPost]
public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent () {
    var basket = await _context.Baskets
                        .GetBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();
    
//checking if basket is already 'null' or not, before proceeding
if (basket == null) return NotFound(new ProblemDetails{Title = "Oops! Your basket is not found!!"});
var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

//checking if intent is there or not
if (intent == null) return BadRequest(new ProblemDetails {
    Title = "Sorry!! your intent for payment is null"
});
//so once we have our intent then we will put the id of this stripe intent into our basket's paymentIntentId property

// ?? - means that the basket is either has previous paymentIntentId and if it is null (??), whatever after (??) will be its new intent Id
basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
//and then we will also update the clientSecret of our stripe payment method, into the client secret property iinside our basket

// ?? - means that the basket is either has previous paymentIntentId and if it is null (??), whatever after (??) will be its new intent Id
basket.ClientSecretForStripe = basket.ClientSecretForStripe ?? intent.ClientSecret;
//finally updating the basket with the new 2 fields
_context.Update(basket);
//now saving all the changes into the database context
var result = await _context.SaveChangesAsync() > 0;

if (!result) return BadRequest(new ProblemDetails {
    Title = "Problem while adding intent from stripe to the basket!!"
});

//since we have to return the BasketDTO from the basket entity, so we have to return the 'extention that we created earlier' which effectively convert the basket to basketDTO
return basket.BasketDTOGetter();
     }

[HttpPost("webhook")]
public async Task<ActionResult> ListenWebhookEvent () {

 // new stream reader
 var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

 // create new stripe event
 var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], 
  _configuration["StripeKeysSettings:WhSecretKey"]
 );

// creating a new charge containing stripe-event
var charge = (Charge)stripeEvent.Data.Object;

// fetching the specific order
var order = await _context.MyOrders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

// checking charge status
if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.isPaymentReceived;

 // updating order table
 _context.Update(order);

 // saving changes and (making quality check)
 await _context.SaveChangesAsync();

 // if changes are ok (saved)
 return new EmptyResult();
 }
}

}