using AssetManagement.DTO;
using AssetManagement.Helper;
using AssetManagement.Model;
using AssetManagement.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/account")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ITokenServices _tokenServices;
        public AccountController(IUserService userService, IMapper mapper, ITokenServices tokenServices)
        {
            _userService = userService;
            _mapper = mapper;
            _tokenServices = tokenServices;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginModel user)
        {
            var currentUser = _userService.GetUserByNameAndPassword(user.UserName, user.Password);
            if (currentUser != null)
            {
                var token = _tokenServices.GenerateToken(currentUser);
                return Ok(
                  new
                  {
                      token = token,
                      userName = currentUser.UserName,
                      userId = currentUser.Id,
                      userDateOfBirth = currentUser.DateOfBirth,
                      userRole = currentUser.Type,
                      userJoinedDate = currentUser.JoinedDate,
                      userGender = currentUser.Gender,
                      userFirstName = currentUser.FirstName,
                      userLastName = currentUser.LastName,
                      userStaffCode = currentUser.StaffCode,
                      userLastLogin = currentUser.LastLogin,
                      userLocation = currentUser.Location
                  }
                  ); ;
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("ChangePassword")]
        public IActionResult ChangePass(ChangePassModel passwordParams)
        {

            var res = _userService.ChangePassword(passwordParams.Id, passwordParams.newPassword, passwordParams.oldPassword);
            if(res == "ok")
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res); 
            }

        }

        [HttpPost]
        [Route("ChangePasswordFirstLogin")]
        public IActionResult ChangePasswordFirstLogin(ChangePassModel passwordParams)
        {

            var res = _userService.ChangePasswordFirstLogin(passwordParams.Id, passwordParams.newPassword);
            if (res == "ok")
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }

        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class ChangePassModel
    {
        public Guid Id { get; set; }
        public string newPassword { get; set; }
        public string oldPassword { get; set; }
    }
}
