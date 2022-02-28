using AssetManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.DTO
{
    public class RequestReturnDTOs
    {
        public DateTime? ReturnDate { get; set; }
        public string State { get; set; }
        public Guid AssignmentId { get; set; }
        public Guid RequestId { get; set; }
        public Guid? AcceptBy { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string AcceptByName { get; set; }
        public string RequestByName { get; set; }
        public Guid RequestBy { get; set; }
        public DateTime AssignedDate { get; set; }
    }
}
