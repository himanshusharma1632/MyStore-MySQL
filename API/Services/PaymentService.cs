using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;  
        }

        //designing the endpoint - reUseable for the pyment service
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent (Basket basket) {
        
        StripeConfiguration.ApiKey = _config["StripeKeysSettings:SecretKey"];
        var service = new PaymentIntentService();
        var intent = new PaymentIntent();
        //here we have to collect the items and their prices kept inside the basket in order to calculate the total and therefore generate the payment intent for that , to be sent to stripe
        var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price); //this will give the exact sub total to the payment service because, product price is the root price of al the prices
        var deliveryFees = subtotal > 10000 ? 0 : 500;
        var total = subtotal + deliveryFees;
        
        if (string.IsNullOrEmpty(basket.PaymentIntentId)){
            var options = new PaymentIntentCreateOptions {
                Amount = total,
                Currency = "inr",
                PaymentMethodTypes = new List<string>{"card"},
            };
            //so this will create a new payment intent for us using all the option object also and integrate to the payment service
            intent = await service.CreateAsync(options);
        }else {
            var options = new PaymentIntentUpdateOptions {
                Amount = total, //because whenever we update our payment intent, we are only updating the amount, so as to specify the newly created payment this time
            };
        }
         return intent;
      }
    }
}