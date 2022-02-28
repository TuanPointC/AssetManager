using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class User
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; }

        public DateTime JoinedDate { get; set; }

        public string Type { get; set; }

        public string Location { get; set; }

        public string UserName { get; set; }
        [DefaultValue(false)]
        public bool DisableFlg { get; set; }

        public string Password { get; set; }
        
        public string StaffCode { get; set; }

        public DateTime? LastLogin {get;set;}
        //
        
    }
}
