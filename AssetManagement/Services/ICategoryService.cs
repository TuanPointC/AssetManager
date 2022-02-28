using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Models;

namespace AssetManagement.Services
{
    public interface ICategoryService
    {
        public IEnumerable<Category> GetCategories();
        public string CreateCategory(Category category);
        ICollection<Report> GetReports(string sortBy, bool isDescending, string location);

    }
}