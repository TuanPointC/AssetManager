using AssetManagement.DTO;
using AssetManagement.Model;
using AssetManagement.Models;
using AssetManagement.Services.Implementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/assignment")]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentServices _assignmentService;
        public AssignmentController(IAssignmentServices assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<AssignmentDTOs>> GetAssignment([FromQuery] PageParams pageParams)
        {
            var listAssignments = _assignmentService.GetAssignments(pageParams);
            var count = listAssignments.Count();

            if (listAssignments.Any())
            {
                listAssignments = listAssignments.OrderBy(on => on.Note)
                 .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                 .Take(pageParams.PageSize)
                 .ToList();

                var metaData = new
                {
                    listAssignments,
                    count
                };
                return Ok(metaData);
            }
            return Ok(new
            {
                listAssignments = new List<Object>(),
                count = 0
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAssignmentById(Guid id)
        {
            try
            {
                var asset = _assignmentService.GetAssignmentById(id);

                if (asset == null) return StatusCode(204, "Assignment is not exist");

                return Ok(_assignmentService.GetAssignmentById(id));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreateAssignment(AssignmentDTOs assignment)
        {
            var res = _assignmentService.CreateAssignment(assignment);
            if (res == "ok")
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteAssignment(Guid id)
        {
            var res = _assignmentService.DeleteAssignment(id);
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
        public IActionResult UpdateAssignment(AssignmentDTOs assignment)
        {
            var res = _assignmentService.UpdateAssignment(assignment);
            if (res == "ok")
            {
                return Ok();
            }
            else
            {
                return BadRequest(res);
            }
        }

        [Route("/api/assignment/accept")]
        [HttpPost]
        public IActionResult AcceptAssignment([FromBody] ChangeStateAssignment data)
        {
            var res = _assignmentService.ChangeStateAssignment(data);
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
