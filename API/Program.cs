using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------- Add Services To The Container ---------------------------------------- //
// service |1| "controller(s)" service
builder.Services.AddControllers();

// service |2| "endpoint(s)" API service
builder.Services.AddEndpointsApiExplorer();

// service |3| "automapper" service 
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// service-group |4| "authentication" & "swagger-gen" service(s)
builder.Services.AddSwaggerGen(c => {
 c.SwaggerDoc( "v1", 
               new OpenApiInfo { 
                                  Title = "WebAPIv5", 
                                  Version = "v1" 
                               });
 c.AddSecurityDefinition("Bearer", 
                         new OpenApiSecurityScheme { 
                            Name = "Authorization",
                            Description = "JWT Auth Token",
                            In = ParameterLocation.Header,
                            Scheme = "Bearer",
                            BearerFormat = "JWT",
                            Type = SecuritySchemeType.ApiKey, 
                        });
 c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    { new OpenApiSecurityScheme { 
        Reference = new OpenApiReference { 
          Type = ReferenceType.SecurityScheme,
          Id = "Bearer", 
        }, 
          Name = "oauth2",
          In = ParameterLocation.Header, 
          Scheme = "Bearer" 
        }, new List<string>()
    }
  });
});

// service |5| "database-context" service
builder.Services.AddDbContext<StoreContext>(opt => {

  // |5.1| "mySQL" running-server version (env : dev.\stage.\prod.)
  MySqlServerVersion serverVersion = new ( new Version (8, 0, 40));

  // condition-check |5.2| "application" environment is "development"
  if (builder.Environment.IsDevelopment()) {
     
    // |5.2.A| "mySQL" connection-string (development)
    string connectionString = builder.Configuration.GetConnectionString("MyDevSQLDatabaseConnection");
  
    // |5.2.B| "mySQL" connection-configuration
    opt.UseMySql(connectionString, serverVersion);
  }
  
  // condition-check |5.3| "application" environment is "production & staging"
  else {
    
    // |5.3.A| "mySQL" connection-string (production & staging) | (generated at runtime by - MonsterAsp.NET.com)
    string connectionString = Environment.GetEnvironmentVariable("MY_PROD_SQL_DATABASE_CONNSTRING");

    // |5.3.B| "mySQL" connection-configuration
    opt.UseMySql(connectionString, serverVersion);
  };
});

// service |6| "CORS" service
builder.Services.AddCors();

// service-group |7| "identity" & "role(s)" service(s)
builder.Services.AddIdentityCore<User>(options => {
  options.User.RequireUniqueEmail = true;
}).AddRoles<Role>()
  .AddEntityFrameworkStores<StoreContext>();
            
// service |8| "authentication" service
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options => {
                             options.TokenValidationParameters = new TokenValidationParameters {
                                    ValidateIssuer = false,
                                    ValidateAudience = false,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                           };
});

// service |9| "authorization" service
builder.Services.AddAuthorization();

// --------------------------------- Application (Custom/3rd-party) Service(s) Pool ---------------------------------- //

// service |10| "jwt-token" service
builder.Services.AddScoped<TokenService>();

// service |11| "payment(s)" service
builder.Services.AddScoped<PaymentService>();

// service |12| "cloudinary-image" service
builder.Services.AddScoped<ImageService>();

// ---------------------------------- Application (HTTP - Pipeline Configuration) ------------------------------------- //

// :: initialize the "build" !
WebApplication application = builder.Build();

// configuration |1| "custom-exeption" configuration
application.UseMiddleware<ExceptionMiddleware>();

// configuration |2| "swagger & swagger-UI" configuration
if (application.Environment.IsDevelopment()) {
  application.UseSwagger();
  application.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
};

// configuration |3| "default-file(s)" configuration
application.UseDefaultFiles(); // telling (ASP.NETCore) API-Server to use default files.

// configuration |4| "static-file(s) [eg. index.html, .js ...]" configuration
application.UseStaticFiles();

// configuration |5| "routing" configuration
application.UseRouting();

// configuration |6| "CORS" configuration
application.UseCors(opt => {
  opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");      
});

// configuration |7| "authentication" configuration
application.UseAuthentication();

// configuration |8| "authorization" configuration
application.UseAuthorization();

// configuration |9| "endpoint(s)" configuration
application.MapControllers();

// configuration |10| "client-fallback-endpoint(s)" configuration
application.MapFallbackToController("Index", "Fallback");

// ------------------------------------- RUN PROGRAM.CS CLASS -------------------------------------- //

// #1 | create : scope for application
var scope = application.Services.CreateScope();

// #2 | declare : data-context with application
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();

// #3 | declare : user-manager with application
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

// #4 | declare : logger with application
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
  // step #1 | migrate the database
  await context.Database.MigrateAsync();

  // step #2 | run "DbInitializer.cs" class
  await DbInitializer.Initialize(context, userManager);

} catch(Exception ex)
{
  // step #3 | log "error" to the terminal-console
  logger.LogError(ex, "There is some problem while migrating the data to database");
};

// step #4 | run "Application"
await application.RunAsync();

