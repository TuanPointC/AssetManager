using AssetManagement.DTO;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Helper
{
    public interface ITokenServices
    {
        public string GenerateToken(UserDTOs user);
        public JwtSecurityToken Verify(string jwt);
    }
}
