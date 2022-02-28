using AssetManagement.DTO;
using AssetManagement.Model;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserDTOs, User>().ReverseMap();

            CreateMap<AssetDTOs, Asset>()
                .ForMember(des => des.CategoryId, act => act.MapFrom(src => src.Category.Id))
                .ForMember(des=>des.Category,act=>act.Ignore())
             .ReverseMap();

            CreateMap<AssignmentDTOs, Assignment>().ReverseMap();
            CreateMap<RequestReturnDTOs, RequestReturn>()
                .ReverseMap()
                .ForMember(des => des.AssetCode, act => act.MapFrom(src => src.Assignment.Asset.AssetCode))
                .ForMember(des => des.AssetName, act => act.MapFrom(src => src.Assignment.Asset.AssetName))
                .ForMember(des => des.AcceptByName, act => act.MapFrom(src => src.Admin.UserName))
                .ForMember(des => des.RequestByName, act => act.MapFrom(src => src.Assignment.User.UserName))
                .ForMember(des => des.AssignedDate, act => act.MapFrom(src => src.Assignment.AssignedDate))
                .ForMember(des => des.RequestByName, act => act.MapFrom(src => src.Staff.UserName));
        }
    }
}
