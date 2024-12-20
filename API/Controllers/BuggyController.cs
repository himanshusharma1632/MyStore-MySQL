using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
        public class BuggyController : BaseApiController
    {
      
      [HttpGet("not-found")]
      public ActionResult GetNotFound()
      {
          return NotFound();
      }

       [HttpGet("bad-request")]
       public ActionResult GetBadRequest()
       {
           return BadRequest(new ProblemDetails{
               Title = "This is the bad Request - 400",
               Status = 400,
           });
       } 

       [HttpGet("unauthorized")]
       public ActionResult GetUnauthorized()
       {
           return Unauthorized();
       } 

       [HttpGet("validation-error")]
       public ActionResult GetValidationError()
       {
           ModelState.AddModelError("Problem-1", "This is the 1st error");
           ModelState.AddModelError("Problem-2", "This is the 2nd Error");
           ModelState.AddModelError("Problem-3", "This is the 3rd error");
           return ValidationProblem();
       } 

       [HttpGet("server-error")]
       public ActionResult GetServerError()
       {
        throw new Exception("This is the internal server error ");
       } 
    }
}