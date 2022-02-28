using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DAO;
using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Models;
using AssetManagement.Services;
using AutoMapper;

namespace AssetManagement.Services.Implementation
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly ICategoryRepo _categoryRepo;
        public CategoryService(ICategoryRepo CategoryRepo, IMapper mapper)
        {
            _categoryRepo = CategoryRepo;
            _mapper = mapper;
        }

        public string CreateCategory(Category category)
        {
            var result = _categoryRepo.CreateCategory(category);
            return result;
        }

        public IEnumerable<Category> GetCategories()
        {
            return _categoryRepo.GetCategories();
        }

        public ICollection<Report> GetReports(string sortBy, bool isDescending, string location)
        {
            return _categoryRepo.GetReports(sortBy, isDescending, location);
        }
    }
}