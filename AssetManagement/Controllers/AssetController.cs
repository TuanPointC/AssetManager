using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/asset")]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _AssetServices;
        private readonly ILogger<AssetController> _logger;
        public AssetController(IAssetService AssetServices, ILogger<AssetController> logger)
        {
            _AssetServices = AssetServices;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult<IEnumerable<AssetDTOs>> GetAssets([FromQuery] PageParams pageParams)
        {
            var listAssets = _AssetServices.GetAssets(pageParams);
            var count = listAssets.Count();

            if (listAssets.Any())
            {
                listAssets = listAssets.OrderBy(on => on.AssetCode)
                 .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                 .Take(pageParams.PageSize)
                 .ToList();

                var metaData = new
                {
                    listAssets,
                    count
                };
                return Ok(metaData);
            }
            return Ok(new
            {
                listAssets = new List<Object>(),
                count = 0
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAssetById(Guid id)
        {
            try
            {
                var asset = _AssetServices.GetAssetById(id);

                if (asset == null) return StatusCode(204, "Asset is not exist");

                return Ok(_AssetServices.GetAssetById(id));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreateAsset(AssetDTOs asset)
        {
            if (asset != null)
            {
                var result = _AssetServices.CreateAsset(asset);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Not null");
                }
            }
            return BadRequest("Not Correct Model");

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteAsset(Guid id)
        {
            var res = _AssetServices.DeleteAsset(id);
            if (res == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateAsset(AssetDTOs asset)
        {
            var res = _AssetServices.UpdateAsset(asset);
            if (res == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(res);
            }
        }
    }
}