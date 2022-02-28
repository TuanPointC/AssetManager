using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class RequestReturn
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RequestId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? ReturnDate { get; set; }
        public Guid? AcceptBy { get; set; }
        public Guid? RequestBy { get; set; }

        [MaxLength(20)]
        public string State { get; set; }
        public Guid? AssignmentId { get; set; }

        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; }

        [ForeignKey("AcceptBy")]
        public User Admin { get; set; }

        [ForeignKey("RequestBy")]
        public User Staff { get; set; }
    }
}
