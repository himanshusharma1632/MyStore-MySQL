using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class ImageService
    {
        private readonly Cloudinary _cloudinary;
        public ImageService(IConfiguration configuration)
        {
         var acc = new Account(
          configuration["Cloudinary:CloudName"],
          configuration["Cloudinary:ApiKey"],
          configuration["Cloudinary:ApiSecret"]
         );

         _cloudinary = new Cloudinary(acc);
        }

        // cloudinary endpoint for uploading an image [to cloudinary API-Server]
        public async Task<ImageUploadResult> AddImageAsync (IFormFile file)
        {
          var imageUploadResult = new ImageUploadResult();

          if (file.Length > 0)
          {
            using var stream = file.OpenReadStream();

            var imageUploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream)         
            };

            imageUploadResult = await _cloudinary.UploadAsync(imageUploadParams);

          }

            return imageUploadResult;
        }

        // cloudinary endpoint for deleting/removing and image [from cloudinary API-Server]
        public async Task<DeletionResult> RemoveImageAsync (string publicId)
        {
          var deletionParams = new DeletionParams(publicId);

          var result = await _cloudinary.DestroyAsync(deletionParams);
          
          return result;
        }
    }
}