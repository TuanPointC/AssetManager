using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/report")]
    public class ReportController : ControllerBase
    {
        private readonly ICategoryService _service;
        public ReportController(ICategoryService service)
        {
            _service = service;
        }
        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult GetReports(string sortBy, bool isDescending, string location)
        {
            var report = _service.GetReports(sortBy, isDescending, location);
            if (report == null) return StatusCode(204, "No reports");
            return Ok(report);
        }
        [HttpGet("export")]
        [Authorize(Roles = "admin")]
        public ActionResult Export(string sortBy, bool isDescending, string location)
        {
            var report = _service.GetReports(sortBy, isDescending, location);

            var stream = new MemoryStream();

            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets.Add("Export");
                worksheet.Row(1).Height = 20;
                worksheet.Row(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Row(1).Style.Font.Bold = true;

                worksheet.Cells.LoadFromCollection(report, true);

                worksheet.Column(1).AutoFit();
                worksheet.Column(2).AutoFit();
                worksheet.Column(3).AutoFit();
                worksheet.Column(4).AutoFit();
                worksheet.Column(5).AutoFit();
                worksheet.Column(6).AutoFit();
                worksheet.Column(7).AutoFit();
                package.Save();
            }

            stream.Position = 0;
            var fileName = $"DataExport_{DateTime.Now}";
            var file = File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);

            return file;
        }

    }
}