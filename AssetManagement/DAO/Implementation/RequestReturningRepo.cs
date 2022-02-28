using AssetManagement.Context;
using AssetManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AssetManagement.DAO.Implementation
{
    public class RequestReturningRepo : IRequestReturningRepo
    {
        private readonly AssetManagementContext _assetManagementContext;
        public RequestReturningRepo(AssetManagementContext assetManagementContext)
        {
            _assetManagementContext = assetManagementContext;
        }

        public string CompleteRequest(Guid id, Guid AdminId)
        {
            try
            {
                var currentRequest = _assetManagementContext.RequestReturns.FirstOrDefault(x => x.RequestId == id);
                if (currentRequest == null)
                {
                    throw new Exception("Request for returning is null!");
                }
                currentRequest.State = "completed";
                currentRequest.ReturnDate = DateTime.Now.AddHours(7);
                currentRequest.AcceptBy = AdminId;
                var currentAssignment = _assetManagementContext.Assignments.FirstOrDefault(x => x.AssignmentId == currentRequest.AssignmentId);
                currentAssignment.State = "canceled";
                _assetManagementContext.Assets.FirstOrDefault(x => x.Id == currentAssignment.AssetId).State = "available";
                _assetManagementContext.SaveChanges();

                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public int CountReturnings()
        {
            throw new NotImplementedException();
        }

        public string CreateRequestReturn(RequestReturn returning)
        {
            try
            {
                var assignment = _assetManagementContext.Assignments.FirstOrDefault(x => x.AssignmentId == returning.AssignmentId);
                if (assignment.IsReturning)
                {
                    return "This assignment created request returning";
                }
                assignment.IsReturning = true;
                _assetManagementContext.RequestReturns.Add(returning);
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string DeleteRequestReturn(Guid id)
        {
            try
            {
                var currentReturn = _assetManagementContext.RequestReturns.FirstOrDefault(x => x.RequestId == id);
                var assignment = _assetManagementContext.Assignments.FirstOrDefault(x => x.AssignmentId == currentReturn.AssignmentId);
                assignment.IsReturning = false;
                if (currentReturn == null)
                {
                    return "Request Returning is null";
                }
                _assetManagementContext.RequestReturns.Remove(currentReturn);
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public RequestReturn GetReturningById(Guid id)
        {
            return _assetManagementContext.RequestReturns.FirstOrDefault();
        }

        public IEnumerable<RequestReturn> GetReturnings(PageParams pageParams)
        {
            IEnumerable<RequestReturn> listReturning = _assetManagementContext.RequestReturns
                .Include(a => a.Assignment).ThenInclude(a => a.User)
                .Include(a => a.Assignment).ThenInclude(a => a.Asset)
                .Include(a => a.Staff)
                .Include(a => a.Admin);

            listReturning = listReturning.Where(a => a.Staff.Location == pageParams.LocationUser);

            //filter by state
            if (pageParams.FilterState != null)
            {
                listReturning = listReturning.Where(returning => returning.State == pageParams.FilterState);
            }
            //filter by date
            if (pageParams.FilterDate != new DateTime(0))
            {
                listReturning = listReturning.Where(assignment => assignment.ReturnDate?.Date == pageParams.FilterDate.Date);
            }

            // filter by name
            if (pageParams.SearchName != null)
            {
                listReturning = listReturning.Where(returning => returning.Assignment.Asset.AssetCode.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase) ||
                                                        returning.Assignment.Asset.AssetName.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase) ||
                                                        returning.Staff.UserName.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase)
                                    );
            }

            return listReturning;
        }

        public string UpdateRequestReturn(RequestReturn returning)
        {
            throw new NotImplementedException();
        }
    }
}
