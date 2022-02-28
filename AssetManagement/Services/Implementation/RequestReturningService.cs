using AssetManagement.DAO;
using AssetManagement.DTO;
using AssetManagement.Model;
using AutoMapper;
using System;
using System.Collections.Generic;

namespace AssetManagement.Services.Implementation
{
    public class RequestReturningService : IRequestReturningService
    {
        private readonly IMapper _mapper;
        private readonly IRequestReturningRepo _requestReturningRepo;

        public RequestReturningService(IMapper mapper, IRequestReturningRepo requestReturningRepo)
        {
            _mapper = mapper;
            _requestReturningRepo = requestReturningRepo;
        }

        public string CompleteRequest(Guid id, Guid AdminId)
        {
            return _requestReturningRepo.CompleteRequest(id,AdminId);
        }

        public int CountReturnings()
        {
            throw new NotImplementedException();
        }

        public string CreateRequestReturn(RequestReturnDTOs returning)
        {
           return  _requestReturningRepo.CreateRequestReturn(_mapper.Map<RequestReturnDTOs, RequestReturn>(returning));
        }

        public string DeleteRequestReturn(Guid id)
        {
            var res = _requestReturningRepo.DeleteRequestReturn(id);
            return res;
        }

        public RequestReturnDTOs GetReturningById(Guid id)
        {
            var res = _requestReturningRepo.GetReturningById(id);
            return _mapper.Map<RequestReturn, RequestReturnDTOs>(res);
        }

        public IEnumerable<RequestReturnDTOs> GetReturnings(PageParams pageParams)
        {
            var listReturning = _requestReturningRepo.GetReturnings(pageParams);
            return _mapper.Map<IEnumerable<RequestReturn>, IEnumerable<RequestReturnDTOs>>(listReturning);
        }

        public string UpdateRequestReturn(RequestReturnDTOs returning)
        {
            throw new NotImplementedException();
        }
    }
}
