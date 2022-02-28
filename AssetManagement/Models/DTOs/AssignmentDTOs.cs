using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Model;

namespace AssetManagement.DTO
{
    public class AssignmentDTOs
    {
        public Guid AssignmentId { get; set; }
        public Guid AssignToId { get; set; }
        public Guid AssignById { get; set; }
        public Guid AssetId { get; set; }

        public DateTime AssignedDate { get; set; }


        public string State { get; set; }
        public bool IsReturning { get; set; } = false;
        public string Note { get; set; }

        public User User { get; set; }

        public User Admin { get; set; }
        public Asset Asset { get; set; }
    }
}
