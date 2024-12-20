using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly IWebHostEnvironment _fileEnv;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, 
        IWebHostEnvironment fileEnv, StoreContext context)
        {
            _context = context;
            _fileEnv = fileEnv;
            _tokenService = tokenService;
            _userManager = userManager;  
        }

//for login
[HttpPost("login")]
public async Task<ActionResult<UserDTO>> LoginUser(LoginDTO loginDTO)
{
var user = await _userManager.FindByNameAsync(loginDTO.userName);
if (user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password)) {
return Unauthorized(new ProblemDetails{
    Title = "Unauthorized",
    Status = 401,
    Detail = "Your Username or Password is incorrect! Please try again..."
});
}

var userBasket = await BasketGetter(loginDTO.userName);
var unknownBasket = await BasketGetter(Request.Cookies["buyerId"]);
if(unknownBasket != null){
    if(userBasket != null) _context.Baskets.Remove(userBasket);
    unknownBasket.BuyerId = user.UserName;
    Response.Cookies.Delete("buyerId");
    await _context.SaveChangesAsync();
}

return new UserDTO {
Email = user.Email,
Token = await _tokenService.GenerateToken(user),
PhoneNumber = user.PhoneNumber,
userName = user.UserName,
Basket = unknownBasket != null ? unknownBasket.BasketDTOGetter() : userBasket?.BasketDTOGetter()
};
}

//for register
[HttpPost("register")]
public async Task<ActionResult> RegisterUser(RegisterDTO registerDTO)
{
var registeredUser = new User{
    UserName = registerDTO.userName,
    Email = registerDTO.Email,
    Name = registerDTO.Name,
    PhoneNumber = registerDTO.PhoneNumber,
};
var result = await _userManager.CreateAsync(registeredUser, registerDTO.Password);
if (!result.Succeeded) {
    foreach(var Error in result.Errors)
    {
        ModelState.AddModelError(Error.Code, Error.Description);
    }
    return ValidationProblem();
}

await _userManager.AddToRoleAsync(registeredUser, "Member");
return StatusCode(201);
}

//getting the current user
[Authorize]
[HttpGet("currentUser")]
public async Task<ActionResult<UserDTO>> GetCurrentUser() {
var user = await _userManager.FindByNameAsync(User.Identity.Name);
var userBasket = await BasketGetter(User.Identity.Name);

return new UserDTO {
Email = user.Email,
Token = await _tokenService.GenerateToken(user),
userName = user.UserName,
PhoneNumber = user.PhoneNumber,
Basket = userBasket?.BasketDTOGetter()
};
}

//endpoint for getting the saved Address
[Authorize]
[HttpGet("savedAddress")]
public async Task<ActionResult<UserAddress>> RetriveUserAddress(){
    return await _userManager.Users.Where(x =>x.UserName == User.Identity.Name)
    .Select(a =>a.Address).FirstOrDefaultAsync();
}

//code for getting the basket
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

 }
}