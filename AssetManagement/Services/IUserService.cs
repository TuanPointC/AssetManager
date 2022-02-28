using AssetManagement.DTO;
using AssetManagement.Model;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services
{
    public interface IUserService
    {
        public IEnumerable<UserDTOs> GetUsers(PageParams pageParams);
        public UserDTOs GetUserById(Guid id);
        public UserDTOs GetUserByNameAndPassword(string userName, string password);
        public User CreateUser(UserDTOs user);
        public User UpdateUser(UserDTOs user);
        public bool DeleteUser(Guid userId);
        public bool CheckValidUser(Guid userId);
        public int CountUsers();
        public string ChangePassword(Guid id, string newPassword, string oldPassword);
        public string ChangePasswordFirstLogin(Guid id, string newPassword);
    }
}
