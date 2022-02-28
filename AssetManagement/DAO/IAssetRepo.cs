using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.DTO;
using AssetManagement.Model;

namespace AssetManagement.DAO
{
    public interface IAssetRepo
    {
        public IEnumerable<Asset> GetAssets(PageParams pageParams);
        public int CountAssets();
        public Asset GetAssetById(Guid id);
        public Asset CreateAsset(Asset asset);
        public string DeleteAsset(Guid id);
        public string UpdateAsset (Asset asset);

    }
}