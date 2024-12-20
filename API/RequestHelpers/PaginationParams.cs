namespace API.RequestHelpers
{
    public class PaginationParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; //initial value of pagenumber
        private int _pageSize = 6;
        public int PageSize {
            get => _pageSize; //get pagesize
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value; //set pagesize after checking
            //whether or not the value is greater then the Maxpage size.
        }

    }
}