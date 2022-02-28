using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Model;
using AssetManagement.Models;

namespace AssetManagement.DAO
{
    public interface ICategoryRepo
    {
        public IEnumerable<Category> GetCategories();
        public string CreateCategory(Category category);
        ICollection<Report> GetReports(string sortBy, bool isDescending, string location);
    }
}