using AssetManagement.Model;
using AssetManagement.Models;
using System;
using System.Collections.Generic;

namespace AssetManagement.DAO
{
    public interface IAssignmentRepo
    {
        public IEnumerable<Assignment> GetAssignments(PageParams pageParams);
        public int CountAssignments();
        public Assignment GetAssignmentById(Guid id);
        public void  CreateAssignment(Assignment assignment);
        public string DeleteAssignment(Guid id);
        public string UpdateAssignment(Assignment assignment);
        public string ChangeStateAssignment(ChangeStateAssignment data);
    }
}
