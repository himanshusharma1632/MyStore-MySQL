using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs
{
    public class RegisterDTO : LoginDTO
    {
         public string Email { get; set; }
         public string Name { get; set; }

         //[NotMapped]
        // public IFormFile profilePhotoURL { get; set; }
         public string PhoneNumber { get; set; }
    }
}