using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [MaxLength(2)]
        [Required]
        public string Prefix { get; set; }

        [MaxLength(255)]
        [Required]
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<Asset> Assets { get; set; }
    }
}
