using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/category")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryServices;
        public CategoryController(ICategoryService categoryServices)
        {
            _categoryServices = categoryServices;
        }
        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var listCategories = _categoryServices.GetCategories();
            return Ok(listCategories);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult CreateCategory(Category category)
        {
            var result = _categoryServices.CreateCategory(category);
            if (result == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}