using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class Assignment
    {
        public Guid AssignmentId { get; set; }
        public Guid AssignToId { get; set; }
        public Guid AssignById { get; set; }
        public bool IsReturning { get; set; } = false;
        public Guid AssetId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime AssignedDate { get; set; }

        [MaxLength(50)]
        public string State { get; set; }

        [MaxLength(255)]
        public string Note { get; set; }

        [ForeignKey("AssignToId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public User User { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("AssignById")]
        public User Admin { get; set; }

        [ForeignKey("AssetId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public Asset Asset { get; set; }
    }
}
