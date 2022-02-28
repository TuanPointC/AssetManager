using AssetManagement.Context;
using AssetManagement.DTO;
using AssetManagement.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AssetManagement.DAO.Implement
{
    public class UserRepo : IUserRepo
    {
        private readonly AssetManagementContext _assetManagementContext;
        private readonly ILogger<UserRepo> _logger;

        public UserRepo(AssetManagementContext assetManagementContext, ILogger<UserRepo> logger)
        {
            _assetManagementContext = assetManagementContext;
            _logger = logger;
        }

        public User CreateUser(User user)
        {
            _assetManagementContext.Users.Add(user);

            _assetManagementContext.SaveChanges();

            var id = _assetManagementContext.Users.ToList().Count;

            var lastName = user.LastName;

            var fistName = convertToUnSign(user.FirstName);

            var splitName = lastName.Split(" ");

            var newLastName = "";

            var firstName = fistName.ToLower();

            foreach (var name in splitName)
            {
                if (name.Trim() != "")
                {
                    newLastName += (convertToUnSign(name.Trim()))[0];
                }
            }

            user.UserName = firstName + newLastName.ToLower() + id;

            user.Password = user.UserName + "@" + user.DateOfBirth.ToString("ddMMyyy");

            user.StaffCode = String.Format("{0}{1:0000}", "SD", id);

            _assetManagementContext.SaveChanges();

            return user;
        }
        public User GetUserById(Guid id)
        {
            var currentUser = _assetManagementContext.Users.Where(b => b.Id == id).FirstOrDefault();
            return currentUser;
        }

        public IEnumerable<User> GetUsers(PageParams pageParams)
        {
            var listUsers = _assetManagementContext.Users.Where(x => x.DisableFlg == false);
            // filter by type
            if (pageParams.FilterTypeUser != null)
            {
                listUsers = listUsers.Where(x => x.DisableFlg == false && x.Type == pageParams.FilterTypeUser);
            }
            // filter by location
            if (pageParams.LocationUser != null)
            {
                listUsers = listUsers.Where(x => x.Location == pageParams.LocationUser);
            }

            //filter by Name
            if (pageParams.SearchName != null)
            {
                var p = pageParams.SearchName;
                listUsers = listUsers.Where(x => x.UserName.Contains(pageParams.SearchName)
                     || x.FirstName.Contains(pageParams.SearchName)
                     || x.LastName.Contains(pageParams.SearchName)
                     || (x.LastName + " " + x.FirstName).Contains(pageParams.SearchName)
                     || (x.StaffCode.Contains(pageParams.SearchName)
                ));
            }
            return listUsers;
        }

        public User UpdateUser(UserDTOs user)
        {
            var currentUser = _assetManagementContext.Users.Single(b => b.Id == user.Id);
            currentUser.DateOfBirth = user.DateOfBirth;
            currentUser.Gender = user.Gender;
            currentUser.JoinedDate = user.JoinedDate;
            currentUser.Type = user.Type;

            _assetManagementContext.SaveChanges();

            return currentUser;
        }
        public bool DeleteUser(Guid userId)
        {
            try
            {
                var user = _assetManagementContext.Users.FirstOrDefault(x => x.Id == userId);
                if (user.DisableFlg == true)
                {
                    return false;
                }
                if (user == null)
                {
                    throw new Exception("This User is not exist!");
                }

                user.DisableFlg = true;
                _assetManagementContext.SaveChanges();
                return true;
            }
            catch
            {
                throw new Exception($"User Null!");
            }

        }

        public static string convertToUnSign(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");

            string temp = s.Normalize(NormalizationForm.FormD);

            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }
        public bool CheckValidUser(Guid userId)
        {
            var assignAssignment = _assetManagementContext.Assignments.Where(x => x.AssignToId == userId).FirstOrDefault();
            if (assignAssignment == null)
            {
                return false;
            }
            return true;
        }

        public int CountUser()
        {
            return _assetManagementContext.Users.Where(x => x.DisableFlg == false).ToList().Count();
        }

        public User GetUserByNameAndPassword(string userName, string password)
        {
            try
            {
                var userAndPassword = userName + " " + password;

                var currentUsers = _assetManagementContext.Users.Where(b =>
                    !b.DisableFlg &&
                    b.UserName == userName &&
                    b.Password == password
                 ).ToArray();

                var currentUser = currentUsers.FirstOrDefault(user => user.UserName.Equals(userName) && user.Password.Equals(password));

                if (currentUser != null && currentUser.LastLogin != null)
                {
                    currentUser.LastLogin = DateTime.Now;
                    _assetManagementContext.SaveChanges();
                }
                return currentUser;
            }
            catch
            {
                return null;
            }
        }

        public void ChangePassword(Guid id, string newPassword, string oldPassword)
        {
            try
            {
                var user = _assetManagementContext.Users.FirstOrDefault(x => x.Id == id);
                if (user != null)
                {
                    if (user.Password == oldPassword)
                    {
                        user.Password = newPassword;
                        user.LastLogin = DateTime.Now;
                        _assetManagementContext.SaveChanges();
                    }
                    else throw new Exception("Old password is not correct!");
                }
                else throw new Exception("User is null!");

            }
            catch (Exception)
            {
                throw;

            }
        }

        public void ChangePasswordFirstLogin(Guid id, string newPassword)
        {
            try
            {
                var user = _assetManagementContext.Users.FirstOrDefault(x => x.Id == id);
                if (user != null)
                {

                    user.Password = newPassword;
                    user.LastLogin = DateTime.Now;
                    _assetManagementContext.SaveChanges();

                }
                else throw new Exception("User is null!");
            }

            catch (Exception)
            {
                throw;

            }
        }
    }
}
