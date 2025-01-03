using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
     public TokenService(UserManager<User> userManager, IConfiguration configuration)
     {
            _configuration = configuration;
            _userManager = userManager;
     }   

//jwt token code - custom token
public async Task<string> GenerateToken(User user, IWebHostEnvironment env)
{
    List<Claim> claims = [
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName),
    ];

//adding a role
var roles = await _userManager.GetRolesAsync(user);
foreach(var role in roles) {
    claims.Add(new Claim(ClaimTypes.Role, role));
}

//adding encryption ()
// configuration - 1 | json-web-token "key-bytes (512bit)" (env=dev | src : appsettings.development.json || env=prod | src : MonsterAspNET env-variables)
string tokenKeyBytes = env.IsProduction() ? Environment.GetEnvironmentVariable("JWTSETTINGS_TOKENKEY") 
                                          : _configuration["JWTSettings:TokenKey"];

// generated "symmetric-security key" (dual-handshaking mechanism)
SymmetricSecurityKey key = new (Encoding.UTF8.GetBytes(tokenKeyBytes)); 

//adding a trusted signature
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

//creating tokenOptions
var options = new JwtSecurityToken(
    issuer : null,
    audience : null,
    claims : claims,
    expires : DateTime.UtcNow.AddDays(7).AddHours(12),
    signingCredentials : creds
);

// writing the token
return new JwtSecurityTokenHandler().WriteToken(options);
    }
  }
}