using AssetManagement.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.DTO
{
    public class AssetDTOs
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
        public Category Category { get; set; }

    }
}
