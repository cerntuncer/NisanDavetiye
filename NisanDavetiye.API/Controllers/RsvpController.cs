using NisanDavetiye.BLL.DTOs;
using NisanDavetiye.BLL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace NisanDavetiye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RsvpController : ControllerBase
{
    private readonly IRsvpService _service;

    public RsvpController(IRsvpService service) => _service = service;

    [HttpPost]
    [EnableRateLimiting("public-forms")]
    public async Task<ActionResult<RsvpDto>> Kaydet([FromBody] RsvpOlusturDto dto)
    {
        try
        {
            return Ok(await _service.KaydetAsync(dto));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RsvpDto>>> Listele() =>
        Ok(await _service.ListeleAsync());

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Gizle(int id)
    {
        await _service.GizleFromAdminAsync(id);
        return NoContent();
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
        var bytes = await _service.ExcelExportAsync();
        return File(bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"katilim-yanitlari-{DateTime.Now:yyyyMMdd-HHmm}.xlsx");
    }
}
