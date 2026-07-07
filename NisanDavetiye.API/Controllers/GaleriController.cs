using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NisanDavetiye.BLL.DTOs;
using NisanDavetiye.BLL.Services;

namespace NisanDavetiye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[RequestSizeLimit(160_000_000)]
public class GaleriController : ControllerBase
{
    private readonly IGaleriService _service;

    public GaleriController(IGaleriService service) => _service = service;

    [HttpPost("upload")]
    [EnableRateLimiting("public-forms")]
    [RequestFormLimits(MultipartBodyLengthLimit = 160_000_000)]
    public async Task<ActionResult<GaleriUploadResultDto>> Upload(
        [FromForm] List<IFormFile> files,
        CancellationToken cancellationToken)
    {
        var uploads = new List<GaleriUploadFile>();
        try
        {
            foreach (var file in files.Where(f => f.Length > 0))
            {
                var stream = new MemoryStream();
                await file.CopyToAsync(stream, cancellationToken);
                stream.Position = 0;
                uploads.Add(new GaleriUploadFile(file.FileName, file.ContentType, stream));
            }

            var result = await _service.UploadAsync(uploads, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new { message = ex.Message });
        }
        finally
        {
            foreach (var upload in uploads)
                await upload.Content.DisposeAsync();
        }
    }
}
