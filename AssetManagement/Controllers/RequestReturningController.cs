using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Services;
using AssetManagement.Services.Implementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/return")]
    public class RequestReturningController : ControllerBase
    {
        private readonly IRequestReturningService _requestReturningService;
        private readonly IAssignmentServices _assignmentServices;
        public RequestReturningController(IRequestReturningService requestReturningService, IAssignmentServices assignmentServices)
        {
            _requestReturningService = requestReturningService;
            _assignmentServices = assignmentServices;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult GetRequestReturning([FromQuery]  PageParams pageParams)
        {
            var listReturns = _requestReturningService.GetReturnings(pageParams);
            var count = listReturns.Count();

            if (listReturns.Any())
            {
                listReturns = listReturns.OrderBy(on => on.ReturnDate)
                 .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                 .Take(pageParams.PageSize)
                 .ToList();

                var metaData = new
                {
                    listReturns,
                    count
                };
                return Ok(metaData);
            }
            return Ok(new
            {
                listReturns = new List<Object>(),
                count = 0
            });
        }

        [HttpPost]
        public IActionResult PostReturn (RequestReturnDTOs returning)
        {
            try
            {
                var assignment = _assignmentServices.GetAssignmentById(returning.AssignmentId);
                if (returning.State != "accepted")
                {
                    throw new Exception("Cannot create request returning with assignment's state is not accepted!");
                }
                var requestReturning = new RequestReturnDTOs
                {
                    ReturnDate =null,
                    AssetName = assignment.Asset.AssetName,
                    AssignedDate = assignment.AssignedDate,
                    AssetCode = assignment.Asset.AssetCode,
                    RequestBy = returning.RequestBy,
                    AssignmentId = assignment.AssignmentId,
                    State = "waiting",
                    AcceptBy = null,
                    AcceptByName = null

                };
                var res = _requestReturningService.CreateRequestReturn(requestReturning);
                if( res == "ok")
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(res);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteReturning(Guid id)
        {
            var res = _requestReturningService.DeleteRequestReturn(id);
            if (res == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(res);
            }
        }
        [Route("complete")]
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CompleteReturn([FromBody] ModelComplete modelComplete)
        {
            var res = _requestReturningService.CompleteRequest(modelComplete.Id, modelComplete.AdminId);
            if(res == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(res);
            }
        }

        public class ModelComplete
        {
            public Guid Id { get; set; }
            public Guid AdminId { get; set; }
        }
    }
}
