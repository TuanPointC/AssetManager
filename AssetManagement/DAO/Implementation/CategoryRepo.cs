using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Context;
using AssetManagement.DAO;
using AssetManagement.Model;
using AssetManagement.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;


namespace AssetManagement.DAO.Implementation
{
    public class CategoryRepo : ICategoryRepo
    {
        private readonly AssetManagementContext _assetManagementContext;

        public CategoryRepo(AssetManagementContext assetManagementContext)
        {
            _assetManagementContext = assetManagementContext;
        }

        public string CreateCategory(Category category)
        {
            try
            {
                _assetManagementContext.Categories.Add(category);
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public IEnumerable<Category> GetCategories()
        {
            return _assetManagementContext.Categories.ToList();
        }

        public ICollection<Report> GetReports(string sortBy, bool isDescending, string location)
        {
            var query = _assetManagementContext.Categories
            .Include(c => c.Assets)
            .Select(g => new Report
            {
                CategoryName = g.Name,
                Total = g.Assets.Where(asset => asset.Location.Contains(location)).Count(),
                Assigned = g.Assets.Where(asset => asset.State == "assigned" && asset.Location.Contains(location)).Count(),
                Available = g.Assets.Where(asset => asset.State == "available" && asset.Location.Contains(location)).Count(),
                NotAvailable = g.Assets.Where(asset => asset.State == "unavailable" && asset.Location.Contains(location)).Count(),
                WaitRecycle = g.Assets.Where(asset => asset.State == "waiting" && asset.Location.Contains(location)).Count(),
                Recycled = g.Assets.Where(asset => asset.State == "recycled" && asset.Location.Contains(location)).Count()
            });
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "categoryName":
                        query = isDescending ? query.OrderByDescending(x => x.CategoryName) : query.OrderBy(x => x.CategoryName);
                        break;
                    case "total":
                        query = isDescending ? query.OrderByDescending(x => x.Total) : query.OrderBy(x => x.Total);
                        break;
                    case "assigned":
                        query = isDescending ? query.OrderByDescending(x => x.Assigned) : query.OrderBy(x => x.Assigned);
                        break;
                    case "available":
                        query = isDescending ? query.OrderByDescending(x => x.Available) : query.OrderBy(x => x.Available);
                        break;
                    case "notAvailable":
                        query = isDescending ? query.OrderByDescending(x => x.NotAvailable) : query.OrderBy(x => x.NotAvailable);
                        break;
                    case "waitRecycle":
                        query = isDescending ? query.OrderByDescending(x => x.WaitRecycle) : query.OrderBy(x => x.WaitRecycle);
                        break;
                    case "recycled":
                        query = isDescending ? query.OrderByDescending(x => x.Recycled) : query.OrderBy(x => x.Recycled);
                        break;
                }
            }

            return query.ToList();
        }
    }
}