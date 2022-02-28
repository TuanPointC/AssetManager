using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DTO;
using AssetManagement.Model;

namespace AssetManagement.Services
{
    public interface IAssetService
    {
        public IEnumerable<AssetDTOs> GetAssets(PageParams pageParams);
        public int CountAssets();
        public AssetDTOs GetAssetById(Guid id);
        public AssetDTOs CreateAsset(AssetDTOs asset);
        public string DeleteAsset(Guid id);
        public string UpdateAsset(AssetDTOs asset);

    }
}
