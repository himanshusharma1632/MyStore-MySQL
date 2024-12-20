using System.Collections.Generic;
using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get;}

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();

            // Automapper Service
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            
            //SwaggerGen Services
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                   Name = "Authorization",
                   Description = "JWT Auth Token",
                   In = ParameterLocation.Header,
                   Scheme = "Bearer",
                   BearerFormat = "JWT",
                   Type = SecuritySchemeType.ApiKey,
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement{
                    {
                        new OpenApiSecurityScheme {
                          Reference = new OpenApiReference {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer", 
                          },
                            Name = "oauth2",
                            In = ParameterLocation.Header,
                            Scheme = "Bearer"
                        },
                       new List<string>()
                    }
                });
            });

            //Database Context Service
            services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
            });

            //Cors Services
            services.AddCors();

            //Identity Service
            services.AddIdentityCore<User>(options => {
            options.User.RequireUniqueEmail = true;
            })
            .AddRoles<Role>()
            .AddEntityFrameworkStores<StoreContext>();
            //Authentication Service
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters{
                     ValidateIssuer = false,
                     ValidateAudience = false,
                     ValidateLifetime = true,
                     ValidateIssuerSigningKey = true,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWTSettings:TokenKey"]))
                };
            });
            //Authorization Service
            services.AddAuthorization();

            //our custom token (JWT) service (from TokenService.cs class)
            services.AddScoped<TokenService>();

            //our payment service (from PaymentService.cs class)
            services.AddScoped<PaymentService>();
            
            // our cloudinary image (upload | delete) service (from ImageService.cs class)
            services.AddScoped<ImageService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ExceptionMiddleware>();          
            if(env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            //for using formFiles
            // app.UseStaticFiles(new StaticFileOptions(){
            //     FileProvider = new PhysicalFileProvider
            //     (Path.Combine(Directory.GetCurrentDirectory(), @"Uploads")), 
            //     RequestPath = new PathString("/Uploads")
            // });
           // 

           app.UseDefaultFiles(); // telling (ASP.NETCore) API-Server to use default files.
           app.UseStaticFiles(); // telling (ASP.NETCore) API-Server to use static files.

           // app.UseHttpsRedirection();
            //app.UseResponseCompression();
            app.UseRouting();
            
            app.UseCors(opt =>
            {
            opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            });

            
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            { 
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });

        }
    }
}
