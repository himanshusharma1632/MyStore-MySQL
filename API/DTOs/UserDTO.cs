namespace API.DTOs
{
    public class UserDTO
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string PhoneNumber { get; set; }
        public string userName { get; set; }
        public BasketDto Basket { get; set; }
    }
}