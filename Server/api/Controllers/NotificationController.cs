using Microsoft.AspNetCore.Mvc;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase 
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(
            IUserRepository userRepository,
            ILogger<NotificationController> logger) 
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpGet("settings/{userId}")]
        public async Task<IActionResult> GetSettings(string userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return NotFound("User not found");

                return Ok(user.NotificationSettings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification settings for user {UserId}", userId);
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("settings/{userId}")]
        public async Task<IActionResult> UpdateSettings(string userId, [FromBody] NotificationSettings settings)
        {
            try
            {
                if (settings == null)
                {
                    _logger.LogWarning("Null settings received for user {UserId}", userId);
                    return BadRequest(new { Message = "Settings cannot be null" });
                }

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return NotFound(new { Message = "User not found" });

                _logger.LogInformation("Updating settings for user {UserId}: {@Settings}", userId, settings);
                await _userRepository.UpdateNotificationSettings(userId, settings);
                
                // Return the updated settings
                var updatedUser = await _userRepository.GetByIdAsync(userId);
                return Ok(updatedUser.NotificationSettings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating notification settings for user {UserId}", userId);
                return BadRequest(new { Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }
    }
}