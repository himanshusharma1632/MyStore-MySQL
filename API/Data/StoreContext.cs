using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> MyOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //fully defining the relationship in UserAddress <-> User
            builder.Entity<User>()
            .HasOne(a => a.Address)
            .WithOne()
            .HasForeignKey<UserAddress>(k => k.Id)
            .OnDelete(DeleteBehavior.Cascade);

            //fully defining the relationships to the IdentityRole
            builder.Entity<Role>()
            .HasData(
                new Role{Id = 1, Name = "Member", NormalizedName = "MEMBER"},
                new Role{Id = 2, Name ="Admin", NormalizedName = "ADMIN"}
            );
        }
    }
}