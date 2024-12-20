using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
               public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context; 
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products
                        .Sort(productParams.OrderBy)
                        .Search(productParams.SearchTerm)
                        .Filter(productParams.Brand, productParams.Type)
                        .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber,
             productParams.PageSize);

            Response.HttpResponseParams(products.MetaData);
            return products;
        
        }

        [HttpGet("{id}", Name = "GetProduct")]

        public async Task<ActionResult<Product>> GetProduct(int id)
        {
          var product = await _context.Products.FindAsync(id);

          if (product == null) return NotFound(new ProblemDetails{ Title = "Sorry! Product could not be found." });

          return product;
      
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters() 
        {

        var brandList = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();

        var typeList = await _context.Products.Select(p => p.TypeofProduct).Distinct().ToListAsync();

        return Ok(new {brandList, typeList});
        
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateNewProduct ([FromForm]CreateProductDTO productDTO)
        {
            var product = _mapper.Map<Product>(productDTO);

            if (productDTO.File != null)
            {
             var imageResult = await _imageService.AddImageAsync(productDTO.File);

             if (imageResult.Error != null) return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message });
             
             product.PictureUrl = imageResult.SecureUrl.ToString();
             
             product.CloudinaryPublicId = imageResult.PublicId;

            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails { Title = "Failed to Add Product to the Database" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct ([FromForm]UpdateProductDTO productDTO)
        {
         
           var product = await _context.Products.FindAsync(productDTO.Id);

           if (product == null) return NotFound();

           _mapper.Map(productDTO, product); // entity framework core tracked changes at this juncture

           if (productDTO.File != null)
           {
            
            var imageResult = await _imageService.AddImageAsync(productDTO.File);

            if (imageResult.Error != null) return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message });

            if (!string.IsNullOrEmpty(product.CloudinaryPublicId)) 
            await _imageService.RemoveImageAsync(product.CloudinaryPublicId);
            
            product.PictureUrl = imageResult.SecureUrl.ToString();
             
            product.CloudinaryPublicId = imageResult.PublicId;
           }
           
           var result = await _context.SaveChangesAsync() > 0;

           if (result) return Ok(product);

           return BadRequest(new ProblemDetails{ Title = "Problem updaing a product !!"});

        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteProduct (int Id) 
        {
          var product = await _context.Products.FindAsync(Id);

          if (product == null) return NotFound();

          if (!string.IsNullOrEmpty(product.CloudinaryPublicId)) 
             await _imageService.RemoveImageAsync(product.CloudinaryPublicId);

          _context.Products.Remove(product);

          var result = await _context.SaveChangesAsync() > 0;

          if (result) return Ok(new ProblemDetails{ Title = "Product deleted Successfully !!"});

          return BadRequest(new ProblemDetails{ Title = "Problem deleting a product !!"});
        }
    }
}