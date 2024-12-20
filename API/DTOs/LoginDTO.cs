using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class LoginDTO
    {
        public string userName { get; set; }
        public string Password { get; set; }
    }
}