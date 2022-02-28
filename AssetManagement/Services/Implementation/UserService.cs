using AssetManagement.DAO;
using AssetManagement.DTO;
using AssetManagement.Model;
using AutoMapper;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services.Implementation
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;
        public UserService(IUserRepo userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }
        public User CreateUser(UserDTOs user)
        {
            try
            {
                var userNew = new User
                {
                    FirstName = user.FirstName.Trim(),
                    LastName = user.LastName.Trim(),
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    JoinedDate = user.JoinedDate,
                    Type = user.Type,
                    Location = user.Location,
                };

                return _userRepo.CreateUser(userNew);
            }
            catch (Exception ex)
            {

                throw new Exception($"User could not be saved: {ex.Message}");
            }

        }

        public UserDTOs GetUserById(Guid id)
        {
            return _mapper.Map<User, UserDTOs>(_userRepo.GetUserById(id));
        }

        public IEnumerable<UserDTOs> GetUsers(PageParams pageParams)
        {
            var users = _userRepo.GetUsers(pageParams);
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserDTOs>>(users);
        }

        public User UpdateUser(UserDTOs user)
        {
            try
            {
                return _userRepo.UpdateUser(user);
            }
            catch (Exception ex)
            {

                throw new Exception($"User could not be saved: {ex.Message}");
            }
        }
        public bool DeleteUser(Guid userId)
        {
            try
            {
                if (!_userRepo.CheckValidUser(userId))
                {
                    var result = _userRepo.DeleteUser(userId);
                    return result;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool CheckValidUser(Guid userId)
        {
            return _userRepo.CheckValidUser(userId);
        }

        public int CountUsers()
        {
            return _userRepo.CountUser();
        }


        public UserDTOs GetUserByNameAndPassword(string userName, string password)
        {
            return _mapper.Map<User, UserDTOs>(_userRepo.GetUserByNameAndPassword(userName, password));
        }




        public string ChangePassword(Guid id, string newPassword, string oldPassword)
        {
            try
            {
                _userRepo.ChangePassword(id, newPassword, oldPassword);
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }


        public string ChangePasswordFirstLogin(Guid id, string newPassword)
        {
            try
            {
                _userRepo.ChangePasswordFirstLogin(id, newPassword);
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}
