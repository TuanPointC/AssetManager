using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class Asset
    {
        public Guid Id { get; set; }

        [MaxLength(20)]
        public string AssetCode { get; set; }

        [MaxLength(255)]
        public string AssetName { get; set; }

        [MaxLength(255)]
        public string Specification { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime InstalledDate { get; set; }

        [MaxLength(20)]
        public string State { get; set; }

        [MaxLength(20)]
        public string Location { get; set; }

        public Guid CategoryId { get; set; }

        [ForeignKey("Id")]
        public Category Category { get; set; }

        //public ICollection<Assignment> Assignments { get; set; }
    }
}
