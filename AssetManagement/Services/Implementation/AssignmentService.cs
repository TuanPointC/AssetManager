using AssetManagement.DAO;
using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Models;
using AutoMapper;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services.Implementation
{
    public class AssignmentService : IAssignmentServices
    {
        private readonly IAssignmentRepo _assignmentRepo;
        private readonly IMapper _mapper;
        public AssignmentService(IAssignmentRepo assignmentRepo, IMapper mapper)
        {
            _assignmentRepo = assignmentRepo;
            _mapper = mapper;
        }

        public string ChangeStateAssignment(ChangeStateAssignment data)
        {
            return _assignmentRepo.ChangeStateAssignment(data);
        }

        public int CountAssignments()
        {
            throw new NotImplementedException();
        }

        public string CreateAssignment(AssignmentDTOs assignment)
        {
            try
            {
                _assignmentRepo.CreateAssignment(_mapper.Map<AssignmentDTOs, Assignment>(assignment));
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string DeleteAssignment(Guid id)
        {
            var res = _assignmentRepo.DeleteAssignment(id);
            return res;
        }

        public AssignmentDTOs GetAssignmentById(Guid id)
        {
            var assignment = _assignmentRepo.GetAssignmentById(id);
            return _mapper.Map<Assignment, AssignmentDTOs>(assignment);
        }

        public IEnumerable<AssignmentDTOs> GetAssignments(PageParams pageParams)
        {
            var listAssignmnet = _assignmentRepo.GetAssignments(pageParams);
            return _mapper.Map<IEnumerable<Assignment>, IEnumerable<AssignmentDTOs>>(listAssignmnet);
        }

        public string UpdateAssignment(AssignmentDTOs assignment)
        {
            return _assignmentRepo.UpdateAssignment(_mapper.Map<AssignmentDTOs, Assignment>(assignment));
        }
    }
}
