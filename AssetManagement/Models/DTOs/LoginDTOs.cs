using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.ComponentModel;
using AssetManagement.Model;

namespace AssetManagement.DTO
{
    public class LoginDTOs
    {
        public Guid UserId { get; set; }
        [DefaultValue(0)]
        public bool DeleteFlg { get; set; }
        [JsonIgnore]
        public virtual List<Assignment> AssignmentsAssigning { get; set; }
    }
}
