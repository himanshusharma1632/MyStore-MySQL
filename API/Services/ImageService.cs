using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class ImageService
    {
        private readonly Cloudinary _cloudinary;
        public ImageService (IConfiguration configuration, IWebHostEnvironment env)
        {

         // configuration - 1 | cloudinary "cloudname" (env=dev | src : dotnet user-secrets || env=prod | src : MonsterAspNET env-variables)
         string cloudinary_cloudName = env.IsProduction() ? Environment.GetEnvironmentVariable("CLOUDINARY_CLOUDNAME") 
                                                          : configuration["Cloudinary:CloudName"];

         // configuration - 2 | cloudinary "apiKey" (env=dev | src : dotnet user-secrets || env=prod | src : MonsterAspNET env-variables)
         string cloudinary_apiKey = env.IsProduction() ? Environment.GetEnvironmentVariable("CLOUDINARY_APIKEY") 
                                                       : configuration["Cloudinary:ApiKey"];

         // configuration -3 | cloudinary "apiSecret" (env=dev | src : dotnet user-secrets || env=prod | src : MonsterAspNET env-variables)
         string cloudinary_apiSecret = env.IsProduction() ? Environment.GetEnvironmentVariable("CLOUDINARY_APISECRET") 
                                                          : configuration["Cloudinary:ApiSecret"]; 

         // create "cloudinary-account" with above creds (env-vise) 
         var acc = new Account(cloudinary_cloudName, cloudinary_apiKey, cloudinary_apiSecret);
         
         // sign-in to cloudinary-account using creds received in "acc" 
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