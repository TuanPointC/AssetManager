using AssetManagement.Model;
﻿using AssetManagement.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.DAO
{
    public interface IUserRepo
    {
        public IEnumerable<User> GetUsers(PageParams pageParams);
        public User GetUserById(Guid id);
        public User GetUserByNameAndPassword(string userName, string password);
        public User CreateUser(User user);
        public User UpdateUser(UserDTOs user);
        public bool DeleteUser(Guid userId);
        public bool CheckValidUser(Guid userId);
        public int CountUser();
        public void ChangePassword(Guid id, string newPassword, string oldPassword);
        public void ChangePasswordFirstLogin(Guid id, string newPassword);
    }
}
