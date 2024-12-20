using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles ()
        {
          CreateMap<CreateProductDTO, Product>(); // map from [CreateProductDTO] to [Product]
          CreateMap<UpdateProductDTO, Product>(); // map from [UpdateProductDTO] to [Product]
        }
    }
}