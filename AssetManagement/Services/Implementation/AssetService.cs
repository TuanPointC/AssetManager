using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DAO;
using AssetManagement.DTO;
using AssetManagement.Model;
using AutoMapper;


namespace AssetManagement.Services.Implementation
{
    public class AssetService : IAssetService
    {
        private readonly IMapper _mapper;
        private readonly IAssetRepo _assetRepo;
        public AssetService(IAssetRepo AssetRepo, IMapper mapper)
        {
            _assetRepo = AssetRepo;
            _mapper = mapper;
        }

        public int CountAssets()
        {
            return _assetRepo.CountAssets();
        }


        public IEnumerable<AssetDTOs> GetAssets(PageParams pageParams)
        {
            var assets = _assetRepo.GetAssets(pageParams);
            return _mapper.Map<IEnumerable<Asset>, IEnumerable<AssetDTOs>>(assets);
        }

        public AssetDTOs CreateAsset(AssetDTOs asset)
        {
            var newAsset = _mapper.Map<AssetDTOs, Asset>(asset);
            var a = _assetRepo.CreateAsset(newAsset);


            var result = _mapper.Map<Asset, AssetDTOs>(a);
            return result;
        }

        public AssetDTOs GetAssetById(Guid id)
        {
            return _mapper.Map<Asset, AssetDTOs>(_assetRepo.GetAssetById(id));
        }

        public string DeleteAsset(Guid id)
        {
            return _assetRepo.DeleteAsset(id);
        }

        public string UpdateAsset(AssetDTOs asset)
        {
            return _assetRepo.UpdateAsset(_mapper.Map<AssetDTOs, Asset>(asset));
        }
    }
}