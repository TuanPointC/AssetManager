using AssetManagement.Context;
using AssetManagement.Model;
using AssetManagement.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AssetManagement.DAO.Implementation
{
    public class AssignmentRepo : IAssignmentRepo
    {
        private readonly AssetManagementContext _assetManagementContext;

        public AssignmentRepo(AssetManagementContext assetManagementContext)
        {
            _assetManagementContext = assetManagementContext;
        }

        public string ChangeStateAssignment(ChangeStateAssignment data)
        {
            try
            {
                var currentAssignment = _assetManagementContext.Assignments.SingleOrDefault(x => x.AssignmentId == data.Id);
                if (currentAssignment == null)
                {
                    return "Assignment is null!";
                }
                else
                {
                    if(currentAssignment.State != "waiting")
                    {
                        return "Assignment is completed!";
                    }
                    currentAssignment.State = data.State;
                    _assetManagementContext.SaveChanges();
                    return "ok";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public int CountAssignments()
        {
            return _assetManagementContext.Assignments.ToList().Count;
        }

        public void CreateAssignment(Assignment assignment)
        {
            try
            {
                if (assignment == null)
                {
                    throw new Exception("Assignment must be not null!");
                }
                var currentAsset = _assetManagementContext.Assets.FirstOrDefault(a => a.Id == assignment.AssetId);
                if (currentAsset.State != "available")
                {
                    throw new Exception("Asset is unvailable!");
                }
                currentAsset.State = "assigned";
                _assetManagementContext.Assignments.Add(assignment);
                _assetManagementContext.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        public string DeleteAssignment(Guid id)
        {
            try
            {
                var assignment = _assetManagementContext.Assignments.SingleOrDefault(a => a.AssignmentId == id && (a.State == "waiting" || a.State == "declined"));
                if (assignment == null)
                {
                    return "Assignment is null!";
                }
                _assetManagementContext.Assignments.Remove(assignment);
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public Assignment GetAssignmentById(Guid id)
        {
            var assignment = _assetManagementContext.Assignments.Include(a => a.Asset).Include(a => a.User).Include(a => a.Admin).Where(asset => asset.AssignmentId == id).FirstOrDefault();
            var cate = _assetManagementContext.Categories.Single(x => x.Id == assignment.Asset.CategoryId);
            assignment.Asset.Category = cate;
            return assignment;
        }

        public IEnumerable<Assignment> GetAssignments(PageParams pageParams)
        {

            IEnumerable<Assignment> listAssignment = _assetManagementContext.Assignments.Include(a => a.Asset).Include(a => a.User).Include(a => a.Admin).ToList();

            listAssignment= listAssignment.Where(listAsm => listAsm.AssignedDate <= DateTime.Now);
            // filter by userId
            if (pageParams.filterUserId != null)
            {
                listAssignment = listAssignment.Where(assignment => assignment.AssignToId == pageParams.filterUserId );
            }

            //filter by state
            if (pageParams.FilterState != null)
            {
                listAssignment = listAssignment.Where(assignment => assignment.State == pageParams.FilterState);
            }
            //filter by date
            if (pageParams.FilterDate != new DateTime(0))
            {
                listAssignment = listAssignment.Where(assignment => assignment.AssignedDate.Date == pageParams.FilterDate.Date);
            }

            // filter by name
            if (pageParams.SearchName != null)
            {
                listAssignment = listAssignment.Where(assignmnet => assignmnet.Asset.AssetCode.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase) ||
                                                        assignmnet.Asset.AssetName.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase) ||
                                                        assignmnet.User.UserName.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase) ||
                                                        (assignmnet.Asset.AssetCode + " " + assignmnet.Asset.AssetName).Contains(pageParams.SearchName,StringComparison.OrdinalIgnoreCase) ||
                                                        assignmnet.Admin.UserName.Contains(pageParams.SearchName,StringComparison.OrdinalIgnoreCase)
                                    );
            }

            listAssignment = listAssignment.Where(x => x.State != "canceled");

            return listAssignment;
        }

        public string UpdateAssignment(Assignment assignment)
        {
            try
            {
                var currentAssignment = _assetManagementContext.Assignments.SingleOrDefault(x => x.AssignmentId == assignment.AssignmentId);
                if (currentAssignment == null)
                {
                    return "Assignment is null!";
                }
                else
                {
                    currentAssignment.Note = assignment.Note;
                    currentAssignment.AssetId = assignment.AssetId;
                    currentAssignment.AssignedDate = assignment.AssignedDate;
                    currentAssignment.AssignById = assignment.AssignById;
                    currentAssignment.AssignToId = assignment.AssignToId;
                    _assetManagementContext.SaveChanges();
                    return "ok";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }
    }
}
