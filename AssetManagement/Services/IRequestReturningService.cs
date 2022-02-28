using AssetManagement.DTO;
using AssetManagement.Model;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services
{
    public interface IRequestReturningService
    {
        public IEnumerable<RequestReturnDTOs> GetReturnings(PageParams pageParams);
        public int CountReturnings();
        public RequestReturnDTOs GetReturningById(Guid id);
        public string CreateRequestReturn(RequestReturnDTOs returning);
        public string DeleteRequestReturn(Guid id);
        public string UpdateRequestReturn(RequestReturnDTOs returning);
        public string CompleteRequest(Guid id, Guid AdminId);
    }
}
