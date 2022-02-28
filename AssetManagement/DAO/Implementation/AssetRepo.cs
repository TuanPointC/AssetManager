using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Context;
using AssetManagement.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AssetManagement.DTO;


namespace AssetManagement.DAO.Implementation
{
    public class AssetRepo : IAssetRepo
    {
        private readonly AssetManagementContext _assetManagementContext;

        public AssetRepo(AssetManagementContext assetManagementContext)
        {
            _assetManagementContext = assetManagementContext;
        }

        public int CountAssets()
        {
            return _assetManagementContext.Assets.ToList().Count;
        }

        public IEnumerable<Asset> GetAssets(PageParams pageParams)
        {
            var listAssets = _assetManagementContext.Assets.Include("Category").ToList();
            // filter by location
            if (pageParams.LocationUser != null)
            {
                listAssets = listAssets.Where(asset => asset.Location == pageParams.LocationUser).ToList();
            }
            //filter by Categoty
            if (pageParams.FilterCategory != null)
            {
                listAssets = listAssets.Where(asset => asset.Category.Name == pageParams.FilterCategory).ToList();
            }
            // filter by Name
            if (pageParams.SearchName != null)
            {
                listAssets = listAssets.Where(asset => asset.AssetName.Contains(pageParams.SearchName,StringComparison.OrdinalIgnoreCase) || 
                        asset.AssetCode.Contains(pageParams.SearchName, StringComparison.OrdinalIgnoreCase)).ToList();

            }
            // filter by State
            if (pageParams.FilterState != null)
            {
                listAssets = listAssets.Where(asset => asset.State == pageParams.FilterState).ToList();
            }

            return listAssets;
        }


        public Asset CreateAsset(Asset asset)
        {
            try
            {
                var count = _assetManagementContext.Assets.Where(a => a.CategoryId == asset.CategoryId).Count();
                var prefix = _assetManagementContext.Categories.Single(c => c.Id == asset.CategoryId).Prefix;

                asset.AssetCode = string.Format("{0}{1:000000}", prefix, count);


                _assetManagementContext.Assets.Add(asset);
                _assetManagementContext.SaveChanges();

                var category = _assetManagementContext.Categories.Where(p => p.Id == asset.CategoryId).FirstOrDefault();
                asset.Category = category;
                return asset;
            }
            catch
            {
                return null;
            }
        }

        public Asset GetAssetById(Guid id)
        {
            var asset = _assetManagementContext.Assets.Where(x => x.Id == id).FirstOrDefault();
            var category = _assetManagementContext.Categories.Where(p => p.Id == asset.CategoryId).FirstOrDefault();
            asset.Category = category;
            return asset;
        }

        public string DeleteAsset(Guid id)
        {
            try
            {
                var currentAsset = _assetManagementContext.Assets.Where(p => p.Id == id).FirstOrDefault();
                if(currentAsset == null)
                {
                    throw new Exception("This Asset is not exist!");
                }

                var IsAssigned = _assetManagementContext.Assignments.Where(x => x.AssetId == id).Any();
                if (IsAssigned)
                {
                    throw new Exception("isAssigned");
                }
                _assetManagementContext.Assets.Remove(currentAsset);
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string UpdateAsset(Asset asset)
        {
            try
            {
                var currentAsset = _assetManagementContext.Assets.Where(p => p.Id == asset.Id).FirstOrDefault();
                if (currentAsset == null)
                {
                    throw new Exception("This Asset is not exist!");
                }
                currentAsset.AssetName = asset.AssetName;
                currentAsset.Specification = asset.Specification;
                currentAsset.State = asset.State;
                currentAsset.InstalledDate = asset.InstalledDate;
                _assetManagementContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}


