using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
   
        public ExceptionMiddleware(RequestDelegate next,
         ILogger<ExceptionMiddleware> logger, IWebHostEnvironment env)
        {
            _env = env;
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
           try
           {
               await _next(context);
           } //this will sit at the top of the tree and check for error

           catch(Exception ex)
           {
            _logger.LogError(ex, ex.Message); //this will not silently catch error but send the response to console
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            var response = new ProblemDetails
            {
            Status= 500,
            Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            Title = ex.Message
            };

            var options = new JsonSerializerOptions{PropertyNamingPolicy = 
            JsonNamingPolicy.CamelCase};
            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
           }
        }
    }
}