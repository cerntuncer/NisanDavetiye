using Microsoft.AspNetCore.Mvc;
using NisanDavetiye.BLL.DTOs;
using NisanDavetiye.BLL.Services;

namespace NisanDavetiye.API.Controllers;

[ApiController]
[Route("api/admin/galeri")]
public class AdminGaleriController : ControllerBase
{
    private readonly IGaleriService _service;

    public AdminGaleriController(IGaleriService service) => _service = service;

    [HttpGet("export")]
    public async Task<IActionResult> ExportZip(CancellationToken cancellationToken)
    {
        try
        {
            var (content, fileName) = await _service.ExportUploadedZipAsync(cancellationToken);
            return File(content, "application/zip", fileName);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("uploaded")]
    public async Task<ActionResult<GaleriSilResultDto>> DeleteAllUploaded()
    {
        var result = await _service.DeleteAllUploadedPhotosAsync();
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<GaleriSilResultDto>> Delete(int id)
    {
        try
        {
            return Ok(await _service.DeleteUploadedPhotoAsync(id));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
