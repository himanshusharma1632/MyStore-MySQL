using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extentions
{
    public static class HttpExtentions
    {
        public static void HttpResponseParams(this HttpResponse response, MetaData metaData)
        {
          var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
          response.Headers.Add("Pagination" , JsonSerializer.Serialize(metaData, options));
          response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

        }
    }
}