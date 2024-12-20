using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallBackController : Controller // this is being derived from Controller class from ASP.NETCore MVC
    {
      public IActionResult Index () {
       return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");  
      }        
    }
}