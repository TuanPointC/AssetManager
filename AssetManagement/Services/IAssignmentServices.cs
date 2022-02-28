using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Models;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services.Implementation
{
    public interface IAssignmentServices
    {
        public IEnumerable<AssignmentDTOs> GetAssignments(PageParams pageParams);
        public int CountAssignments();
        public AssignmentDTOs GetAssignmentById(Guid id);
        public string CreateAssignment(AssignmentDTOs assignment);
        public string DeleteAssignment(Guid id);
        public string UpdateAssignment(AssignmentDTOs assignment);
        public string ChangeStateAssignment(ChangeStateAssignment data);
    }

}