using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count,  int pageNumber, int pageSize)
        {
            MetaData = new MetaData{
            PageSize = pageSize,
            TotalCount = count,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize),
            CurrentPage = pageNumber,
            };
            AddRange(items);
        }
        public MetaData MetaData { get; set; }

        //method for new PagedList
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query,
        int pageNumber, int pageSize)
         {
         var count = await query.CountAsync(); //count total pages
         var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); //skip previous pages when current page is opened
         return new PagedList<T>(items, count, pageNumber, pageSize); //returning a new PagedList 
         }
    }


}