using Microsoft.AspNetCore.Mvc;
using Server.core.entities;
using Server.core.interfaces;

namespace Server.api.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase {
        private readonly IHealthService _healthService;

        public HealthController(IHealthService healthService) {
            _healthService = healthService;
        }

        [HttpGet("fetch-health")]
        public async Task<IActionResult> FetchHealthInfo(string userId) {
            try {
                var healthInfo = await _healthService.FetchHealthInfo(userId);
                return Ok(healthInfo);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
