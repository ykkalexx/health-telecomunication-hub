using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.api.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase { 

        private readonly IGoalService _goalService;
        private readonly ILogger<GoalsController> _logger;

        public GoalsController(IGoalService goalService, ILogger<GoalsController> logger) {
            _goalService = goalService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalDto goalDto) {
            try {
                // Get userId from the request body
                if (string.IsNullOrEmpty(goalDto.UserId)) {
                    return BadRequest("UserId is required");
                }

                var goal = await _goalService.CreateGoalAsync(goalDto.UserId, goalDto);
                return Ok(goal);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error creating goal");
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetGoals(string userId) {
            try {
                if (string.IsNullOrEmpty(userId)) {
                    return BadRequest("UserId is required");
                }

                var goals = await _goalService.GetGoalsAsync(userId);
                return Ok(goals);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error fetching goals for user {UserId}", userId);
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{goalId}")]
        public async Task<IActionResult> UpdateGoal(string goalId, [FromBody] UpdateGoalDto updateDto) {
            try {
                // Get userId from request body like other endpoints
                if (string.IsNullOrEmpty(updateDto.UserId)) {
                    return BadRequest("UserId is required");
                }

                var goal = await _goalService.UpdateGoalAsync(updateDto.UserId, goalId, updateDto);
                return Ok(goal);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error updating goal");
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
