using AssetManagement.Model;
using System;
using System.Collections.Generic;

namespace AssetManagement.DAO
{
    public interface IRequestReturningRepo
    {
        public IEnumerable<RequestReturn> GetReturnings(PageParams pageParams);
        public int CountReturnings();
        public RequestReturn GetReturningById(Guid id);
        public string CreateRequestReturn(RequestReturn returning);
        public string DeleteRequestReturn(Guid id);
        public string UpdateRequestReturn(RequestReturn returning);
        public string CompleteRequest (Guid id, Guid AdminId);
    }
}
