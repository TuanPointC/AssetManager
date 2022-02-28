using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userServices;
        private readonly ILogger<UserController> _logger;
        public UserController(IUserService userServices, ILogger<UserController> logger)
        {
            _userServices = userServices;
            _logger = logger;
        }


        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult<IEnumerable<UserDTOs>> GetUsers([FromQuery] PageParams pageParams)
        {

            var listUsers = _userServices.GetUsers(pageParams);
            var count = listUsers.Count();
            if (listUsers.Any())
            {
                listUsers = listUsers.OrderBy(on => on.StaffCode)
                            .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                            .Take(pageParams.PageSize)
                            .ToList();

                var metaData = new
                {
                    listUsers,
                    count
                };
                return Ok(metaData);
            }
            return Ok(new
            {
                listUsers = new List<Object>(),
                count = 0
            });

        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public ActionResult GetUserById(Guid id)
        {
            var b = _userServices.GetUserById(id);
            if (b != null)
            {
                return Ok(b);
            }
            return NotFound();
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult CreateUser(UserDTOs user)
        {
            var newUser = _userServices.CreateUser(user);
            if (newUser != null)
            {
                return Ok(newUser);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        public ActionResult UpdateUser(UserDTOs user)
        {
            try
            {
                var updatedUser = _userServices.UpdateUser(user);
                if (updatedUser != null)
                {
                    return Ok(updatedUser);
                }
                return BadRequest("Fail to update user");
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("check-valid/{id}")]
        [Authorize(Roles = "admin")]
        public ActionResult CheckValidUser(Guid id)
        {
            var b = _userServices.GetUserById(id);
            if (b != null)
            {
                if (_userServices.CheckValidUser(id))
                {
                    return Ok(new { message = "User still have active assignment", result = true });
                }
                return Ok(new { message = "User have no active assignment", result = false });
            }
            return StatusCode(204, "User is not exist");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteUser(Guid id)
        {
            if (_userServices.DeleteUser(id))
            {
                return Ok(new { message = "Disable user successfully!", result = true });
            }
            return new JsonResult(new { message = "Disable user unsuccessfully!", result = false });
        }
    }
}
